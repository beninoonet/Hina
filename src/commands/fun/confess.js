const { Command } = require('@sapphire/framework');
const { EmbedBuilder, ButtonBuilder } = require('discord.js');
const { CONFESS_CHANNEL_ID } = process.env;

class ConfessCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }
  // Enregistrer la commande 
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('confess')
        .setDescription('Tu peux faire une confession anonyme dans le serveur')
        .addStringOption(option => option
            .setName('message')
            .setDescription('Le message de ta confession')
            .setRequired(true)
        )
    );
  }

  async chatInputRun(interaction) {
    const message = interaction.options.getString('message');
    const customId = 'confess_button';
      // Créer le bouton pour répondre à la confession
    const button = new ButtonBuilder()
      .setCustomId('confess_button')
      .setLabel('Faire ma confession')
      .setStyle(1);
    // Envoyer le message de confession dans un salon spécifique
    const confessionChannel = interaction.guild.channels.cache.get(CONFESS_CHANNEL_ID);
    if (!confessionChannel) {
      return interaction.reply({ content: 'Le salon de confession est introuvable.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('Nouvelle confession')
      .setDescription(`${message}`)
      .setColor('#FF69B4')
      .setFooter({ text: 'Utilisateur anonyme' })
      .setTimestamp();
    const response = await confessionChannel.send({ embeds: [embed], components: [{ type: 1, components: [button] }] });

    const thead = await confessionChannel.threads.create({
      name: `Discussion de la confession`,
      autoArchiveDuration: 60,
      reason: 'Discussion pour la confession',
    });

    thead.send({ content: `Discussion pour la confession : \n${message}` });
    await interaction.reply({ content: 'Ta confession a été envoyée anonymement !', ephemeral: true });
  }
}
module.exports = {
  ConfessCommand
};
