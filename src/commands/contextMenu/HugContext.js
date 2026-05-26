
const { Command } = require('@sapphire/framework');
const fetch = require('node-fetch');
const { EmbedBuilder, Application } = require('discord.js');
const dotenv = require('dotenv');
const { fetchError } = require('../../assets/msg/error.json');
dotenv.config();


class HugContextMenuCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }
  // Enregistrer la commande de menu contextuel
  registerApplicationCommands(registry) {
    registry.registerContextMenuCommand((builder) =>
      builder.setName('Hug')
        .setType(2)
    );
  }
  // Méthode pour récupérer une image de câlin depuis l'API waifu.pics
  fetchWaifu() {
      return fetch('https://nekos.best/api/v2/hug')
        .then(response => response.json())
        .then(data => data.results[0].url)
        .catch(error => {
          console.error('Error fetching waifu image:', error);
          throw new Error('Failed to fetch waifu image');
        });
      }
    async contextMenuRun(interaction) {
    const target = interaction.targetMember || interaction.targetUser;
    const gif = await this.fetchWaifu();

    try {
        // Créer un embed avec le GIF de câlin
        if (target.id === interaction.user.id) {
          const embed = new EmbedBuilder()
            .setTitle(`🤗 Gros câlin pour ${interaction.member.displayName}`)
            .setImage(`${gif}`);
          await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
          .setTitle(`🤗 ${interaction.member.displayName} fait un câlin à ${target.displayName}! `)
          .setImage(`${gif}`);
        await interaction.reply({ content: `<@${target.id}>`, embeds: [embed] });
        // Répondre à l'utilisateur avec le GIF de câlin

        }
      } 
      // Gérer les erreurs de l'API Giphy
      catch (error) {
        console.error('Error fetching hug gif:', error);
        await interaction.reply(fetchError.replace('{action}', 'hug'));
      }
    }
}
module.exports = {
  HugContextMenuCommand
};
