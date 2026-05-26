const { Command } = require('@sapphire/framework');
const { MessageFlags, EmbedBuilder } = require('discord.js');

class UserInfoCommand extends Command {
  constructor(context, options) {
    super(context, { ...options,
      name: 'userinfo',
      description: 'Obtenir des informations sur un utilisateur',
     });
  }


  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('userinfo')
    .setDescription('Get information about a user')
    .addUserOption(option => option.setName('target')
    .setDescription('The member to get information about').setRequired(false))
    );
  }
    async chatInputRun(interaction) 
    {
      // Récupérer l'utilisateur ciblé ou l'utilisateur qui a exécuté la commande
      const target = interaction.options.getUser('target');
      // Créer un embed avec les informations de l'utilisateur
      const embed = new EmbedBuilder()
        .setTitle(`Informations sur ${target ? target.tag : interaction.user.tag}`)
        .setThumbnail(target ? target.displayAvatarURL({ dynamic: true }) : interaction.user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'ID', value: target ? target.id : interaction.user.id, inline: true },
          { name: 'Nom d\'utilisateur', value: target ? target.username : interaction.user.username, inline: true },
          { name: 'Bot', value: target ? (target.bot ? 'Oui' : 'Non') : (interaction.user.bot ? 'Oui' : 'Non'), inline: true },
          { name: 'Créé le', value: `<t:${Math.floor((target ? target.createdTimestamp : interaction.user.createdTimestamp) / 1000)}:R>`, inline: false }
        )
        .setColor('#00FF00');
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }

}
module.exports = {
    UserInfoCommand
};