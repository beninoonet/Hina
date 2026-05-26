
const { Command } = require('@sapphire/framework');
const fetch = require('node-fetch');
const { EmbedBuilder, Application } = require('discord.js');
const dotenv = require('dotenv');
const { fetchError } = require('../../assets/msg/error.json');
dotenv.config();


class SlapContextMenuCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }
  // Enregistrer la commande de menu contextuel
  registerApplicationCommands(registry) {
    registry.registerContextMenuCommand((builder) =>
      builder.setName('Slap')
        .setType(2)
    );
  }
  // Méthode pour récupérer une image de gifle depuis l'API waifu.pics
  fetchWaifu() {
      return fetch('https://nekos.best/api/v2/slap')
        .then(response => response.json())
        .then(data => data.results[0].url)
        .catch(error => {
          console.error('Error fetching waifu image:', error);
          throw new Error('Failed to fetch waifu image');
        });
      }
    async contextMenuRun(interaction) {
    const target = interaction.targetUser || interaction.targetMember;
    const gif = await this.fetchWaifu();


    try {
        // Créer un embed avec le GIF de gifle
        if (target.id === interaction.user.id) {
          const embed = new EmbedBuilder()
            .setTitle(`👋 Grosse gifle pour ${interaction.member.displayName}`)
            .setImage(`${gif}`);
          await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
          .setTitle(`👋${interaction.member.displayName} gifle à ${target.displayName}! `)
          .setImage(`${gif}`);
        await interaction.reply({ content: `<@${target.id}>`, embeds: [embed] });
        // Répondre à l'utilisateur avec le GIF de gifle

        }
      } 
      // Gérer les erreurs de l'API Giphy
      catch (error) {
        console.error('Error fetching slap gif:', error);
        await interaction.reply(fetchError.replace('{action}', 'slap'));
      }
    }
}
module.exports = {
  SlapContextMenuCommand
};
