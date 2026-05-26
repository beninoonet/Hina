const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
const { fetchError } = require('../../assets/msg/error.json');
dotenv.config();


class RandomGifCommand extends Command {
  constructor(context, options) {
    super(context, { ...options,
      name: 'randomgif',
      description: 'Affiche un GIF aléatoire',
     });
  }
  // Enregistrer la commande 
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('randomgif')
        .setDescription('Affiche un GIF aléatoire')
    );
  }


  async chatInputRun(interaction) {
    try {
        // Récupérer un GIF aléatoire depuis l'API Giphy
        const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_API_KEY}&tag=anime`);
        const data = await response.json();
        // Créer un embed avec le GIF aléatoire
        const embed = new EmbedBuilder()
          .setTitle('Voici un GIF aléatoire pour toi!')
          .setImage(`${data.data.images.original.url}`);
        await interaction.reply({ embeds: [embed] });
        // Répondre à l'utilisateur avec le GIF aléatoire
      }
      // Gérer les erreurs de l'API Giphy
      catch (error) {
        console.error('Error fetching random gif:', error);
        // Utiliser le message d'erreur importé depuis le fichier JSON
        await interaction.reply(fetchError.replace('{action}', 'fetch a random gif'));
      }
        }
  }
module.exports = {
  RandomGifCommand
};
