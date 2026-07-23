const { Command } = require('@sapphire/framework');
const { MessageFlags, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require('discord.js');

class EmbedCreatorCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder
    .setName('embed')
    .setDescription('Create an embed message')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('The channel to send the embed to')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText))

    );
  }

  async chatInputRun(interaction) {
    const channel = interaction.options.getChannel('channel');

    // Check if the selected channel is a text channel
    if (!channel || channel.type !== ChannelType.GuildText) {
      return interaction.reply({ content: 'Please select a valid text channel.', ephemeral: true });
    }

    try {
       
    // Modal for embed creation
    const modal = new ModalBuilder()
      .setCustomId(`embedModal-${channel.id}`)
      .setTitle('Create an Embed');
    // Text input for title
    const titleInput = new TextInputBuilder()
      .setCustomId('embedTitle')
      .setLabel('Embed Title')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const descriptionInput = new TextInputBuilder()
      .setCustomId('embedDescription')
      .setLabel('Embed Description')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      { type: 1, components: [titleInput] },
      { type: 1, components: [descriptionInput] },

    );
      // Show modal to user
      await interaction.showModal(modal);
    } catch (error) {
      console.error('Error creating modal:', error);
      return interaction.reply({ content: 'There was an error while trying to create the embed modal.', ephemeral: true });
    }

    


  }
}
module.exports = {
  EmbedCreatorCommand
};