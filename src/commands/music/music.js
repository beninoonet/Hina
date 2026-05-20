const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');


class MusicCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('play')
        .setDescription('Joue une musique à partir d\'une URL ou d\'une recherche')
        .addStringOption(option =>
          option.setName('query')
            .setDescription('URL ou terme de recherche')
            .setRequired(true)
        )
    );
  }

  async chatInputRun(interaction) {
    const query = interaction.options.getString('query');
    const player = this.container.client.shoukaku.players.get(interaction.guildId);

    if (!player) {
      await interaction.reply({ content: 'Je ne suis pas connecté à un canal vocal !', ephemeral: true });
      return;
    }
    try {
      const result = await player.search(query, interaction.user.id);
      if (result.loadType === 'LOAD_FAILED') {
        await interaction.reply({ content: 'Une erreur est survenue lors de la recherche de la musique.', ephemeral: true });
        return;
      }
      if (result.loadType === 'NO_MATCHES') {
        await interaction.reply({ content: 'Aucun résultat trouvé pour votre recherche.', ephemeral: true });
        return;
      } 
      const track = result.tracks[0];
      await player.play(track);
      const embed = new EmbedBuilder()
        .setTitle('Lecture en cours')
        .setDescription(`[${track.info.title}](${track.info.uri})`)
        .setThumbnail(track.info.thumbnail)
        .addFields(
          { name: 'Durée', value: this.formatDuration(track.info.length), inline: true },
          { name: 'Auteur', value: track.info.author, inline: true }
        );
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Erreur lors de la lecture de la musique :', error);
      await interaction.reply({ content: 'Une erreur est survenue lors de la lecture de la musique.', ephemeral: true });
    }
  }

}
module.exports = {
  MusicCommand
};