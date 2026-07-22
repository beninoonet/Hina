const { Command } = require('@sapphire/framework');
const { MessageFlags } = require('discord.js');

const axios = require('axios');

class PokedexCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
    .setName('pokedex')
    .setDescription('Un pokédex tout neuf pour les dresseurs de Pokémon !')
    .addStringOption((option) =>
      option
        .setName('pokemon')
        .setDescription('Le nom du Pokémon à rechercher')
        .setRequired(true))
    );
  }

  async chatInputRun(interaction) {
    // Récupère le nom du Pokémon
    const pokemonName = interaction.options.getString('pokemon').toLowerCase();
    await interaction.deferReply({ ephemeral: true });
    
    try {
        // requete à l'API
        const res = await axios.get(`https:/tyradex.app/api/v1/pokemon/${pokemonName}`);

        const pokemonData = res.data;

        if (!pokemonData) {
            await interaction.editReply({ content: `Le Pokémon "${pokemonName}" n'a pas été trouvé. Veuillez vérifier l'orthographe et réessayer.`, ephemeral: true });
            return;
        }

    }
    catch (error) {
        if (error.response && error.response.status === 404) {
            await interaction.editReply({ content: `Le Pokémon "${pokemonName}" n'a pas été trouvé. Veuillez vérifier l'orthographe et réessayer.`, ephemeral: true });
        }
        else {
            console.error(error);
            await interaction.editReply({ content: 'Une erreur est survenue lors de la récupération des informations du Pokémon. Veuillez réessayer plus tard.', ephemeral: true });
            consoloe.error("Pokedex" + error);
        }
    }
  }
}
module.exports = {
  PokedexCommand
};