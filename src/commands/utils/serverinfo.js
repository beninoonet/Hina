const { Command } = require('@sapphire/framework');
const { MessageFlags, EmbedBuilder } = require('discord.js');

class ServerInfoCommand extends Command {
  constructor(context, options) {
    super(context, { ...options,
      name: 'serverinfo',
      description: 'Obtenir des informations sur le serveur',
     });
  }


  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('serverinfo').setDescription('Get information about the server')
    );

  }

  async chatInputRun(interaction) {
    const { guild } = interaction;
    if (!guild) {
      return interaction.reply({ content: 'This command can only be used in a server.', flags: MessageFlags.Ephemeral });
    }
    
    const { name, id, memberCount, createdAt, ownerId } = guild;
    const embed = new EmbedBuilder()
      .setTitle('Server Information')
      .setColor(0x00AE86)
      .addFields(
        { name: 'Server Name', value: name, inline: true },
        { name: 'Server ID', value: id, inline: true },
        { name: 'Member Count', value: memberCount.toString(), inline: true },
        { name: 'Created At', value: createdAt.toDateString(), inline: true },
        { name: 'Owner ID', value: ownerId, inline: true }
      );
    return interaction.reply({ embeds: [embed] });
  }
}
module.exports = {
    ServerInfoCommand
};