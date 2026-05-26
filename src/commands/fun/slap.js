const { Command } = require('@sapphire/framework');
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
const { fetchError } = require('../../assets/msg/error.json');
dotenv.config();


class SlapCommand extends Command {
  constructor(context, options) {
    super(context, { ...options,
      name: 'slap',
      description: 'Donne un coup de poing à quelqu\'un',
     });
  }
  // Enregistrer la commande 
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('slap')
        .setDescription('Donne un coup de poing à quelqu\'un')
        .addUserOption(option => option
            .setName('target')
            .setDescription('Utilisateur à qui donner un coup de poing')
            .setRequired(true)
        )
    );
  }
  fetchWaifu() {
        return fetch('https://nekos.best/api/v2/slap')
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
        // Créer un embed avec le GIF de coup de poing
        if (target.id === interaction.user.id) {
          const embed = new EmbedBuilder()
            .setTitle(`👋 ${interaction.member.displayName} se gifle lui-même! (idiot(e)) `)
            .setImage(`${gif}`);
          await interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
          .setTitle(`👋 ${interaction.member.displayName} gifle ${target.displayName}! `)
          .setImage(`${gif}`);
        await interaction.reply({ content: `<@${target.id}>`, embeds: [embed] });
        // Répondre à l'utilisateur avec le GIF de coup de poing

        }
      } 
      // Gérer les erreurs de l'API Giphy
      catch (error) {
        console.error('Error fetching slap gif:', error);
        // Utiliser le message d'erreur importé depuis le fichier JSON
        await interaction.reply(fetchError.replace('{action}', 'slap'));
      }
    }

  }
module.exports = {
  SlapCommand
};
