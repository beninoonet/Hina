const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

class RoleInfoCommand extends Command {
  constructor(context, options) {
    super(context, { ...options,
      name: 'roleinfo',
      description: 'Obtenir des informations sur un rôle',
     });
  }


  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('roleinfo')
    .setDescription('Get information about a role')
    .addRoleOption(option => option.setName('target')
    .setDescription('The role to get information about').setRequired(false))
    );
  }
    async chatInputRun(interaction) {
      const role = interaction.options.getRole('target') || interaction.member.roles.highest;
      const embed = new EmbedBuilder()
        .setTitle('📄 Information sur le rôle')
        .setColor(0x00AE86)
        .addFields(
          { name: '🏷️Nom du rôle', value: role.name, inline: true },
          { name: '🆔ID', value: role.id, inline: true },
          { name: '🎨Couleur', value: role.color ? role.color.toString(16).padStart(6, '0') : 'Aucune', inline: true },
          { name: '👑Géré par le bot', value: role.managed ? 'Oui' : 'Non', inline: true },
          { name: '🔒Mentionnable', value: role.mentionable ? 'Oui' : 'Non', inline: true },
          { name: '👥Nombre de membres', value: role.members.size.toString(), inline: true },
        );

      return interaction.reply({ embeds: [embed] });
    }
}
module.exports = {
    RoleInfoCommand
};