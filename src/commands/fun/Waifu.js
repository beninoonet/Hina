const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

class WaifuCommand extends Command {
  constructor(context, options) {
    super(context, { ...options,
      name: 'waifu',
      description: 'Affiche une image aléatoire de waifu',
     });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('waifu').setDescription('Affiche une image aléatoire de waifu')
    );
  }

  fetchWaifu() {
    return fetch('https://api.waifu.im/images?IsNsfw=False')
      .then(response => response.json())
      .then(data => data.items[0].url)
      .catch(error => {
        console.error('Error fetching waifu image:', error);
        throw new Error('Failed to fetch waifu image');
      });
    }

  async chatInputRun(interaction) {
    try {
      const waifuUrl = await this.fetchWaifu();
      const embed = new EmbedBuilder()
        .setTitle('Waifu aléatoire')
        .setImage(waifuUrl || waifuUrl2)
        .setURL(waifuUrl || waifuUrl2)
        .setColor('#ff0000');
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching waifu image:', error);
      await interaction.reply('Désolé, je n\'ai pas pu récupérer une image de waifu pour le moment. Essaie à nouveau plus tard !');
    }
  }
}
module.exports = {
  WaifuCommand
};