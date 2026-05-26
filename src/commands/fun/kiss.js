const { Command } = require('@sapphire/framework');
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
// Importer le message d'erreur depuis le fichier JSON
const { fetchError } = require('../../assets/msg/error.json');
dotenv.config();


class KissCommand extends Command {
  constructor(context, options) {
    super(context, { ...options,
      name: 'kiss',
      description: 'Fais un bisou à quelqu\'un *(existe en contextmenu)*',
     });
  }
  // Enregistrer la commande
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('kiss')
        .setDescription('Fais un bisou à quelqu\'un')
        .addUserOption(option => option
            .setName('target')
            .setDescription('Utilisateur à qui faire un bisou')
            .setRequired(true)
        )
    );
  }

  fetchWaifu() {
        return fetch('https://nekos.best/api/v2/kiss')
          .then(response => response.json())
          .then(data => data.results[0].url)
          .catch(error => {
            console.error('Error fetching waifu image:', error);
            throw new Error('Failed to fetch waifu image');
          });
        }

  async chatInputRun(interaction) {
    const target = interaction.options.getUser('target');
    const gif = await this.fetchWaifu();

    try {
        // Créer un embed avec le GIF de bisou
        if (target.id === interaction.user.id) {
          const embed = new EmbedBuilder()
            .setTitle(`${interaction.member.displayName} s\'embrasse lui-même 😘 (ça va l'égo ?) `)
            .setImage(`${gif}`);
          await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
          .setTitle(`${interaction.member.displayName} embrasse ${target.displayName}! 😘`)
          .setImage(`${gif}`);
        await interaction.reply({ content: `<@${target.id}>`, embeds: [embed] });
        // Répondre à l'utilisateur avec le GIF de bisou

        }
      } 
      // Gérer les erreurs de l'API Giphy
      catch (error) {
        console.error('Error fetching kiss gif:', error);
        // Utiliser le message d'erreur importé depuis le fichier JSON
        await interaction.reply(fetchError.replace('{action}', 'kiss'));
      }
    }

  }
module.exports = {
  KissCommand
};
