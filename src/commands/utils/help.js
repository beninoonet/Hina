const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');

class HelpCommand extends Command {
  constructor(context, options) {
    super(context, { ...options,
      name: 'help',
      description: 'obtenir de l\'aide sur les commandes disponibles',
     });
  }


  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('help')
    .setDescription('obtenir de l\'aide sur les commandes disponibles')
    );
  }
    async chatInputRun(interaction) {
        const commands = this.container.stores.get('commands');
        const member = interaction.member;

        const filteredCommands = commands.filter((cmd) => {
            if (!cmd.description) return false; // Exclude commands without a description

            // check if member has permissions for the command
            if (cmd.options?.requiredUserPermissions) {
                const requiredPermissions = new PermissionsBitField(cmd.options.requiredUserPermissions);
                return member.permissions.has(requiredPermissions);
            }

            return true; // No permissions required, include the command
        });

        const embed = new EmbedBuilder()
            .setTitle('🪧 Menu d\'aide')
            .setColor('#0099ff')
            .setDescription('Voici la liste des commandes disponibles.')
            .setFooter({ text: `${filteredCommands.size} commandes disponibles - Hina` })
            .setTimestamp();


            for (const [, cmd] of filteredCommands) {
                embed.addFields(
                  { name: `/${cmd.name}`, 
                  value: cmd.description || 'Aucune description disponible', 
                  inline: false });
            };

        await interaction.reply({ embeds: [embed], ephemeral: true });
          };
}
module.exports = {
    HelpCommand
};