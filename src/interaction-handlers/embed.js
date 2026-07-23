const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const { EmbedBuilder, MessageFlags } = require('discord.js');

class EmbedInteractionHandler extends InteractionHandler {
  constructor(context, options) {
    super(context, { 
        ...options, 
        interactionHandlerType: InteractionHandlerTypes.ModalSubmit });
    }

    parse(interaction) {
        if (interaction.customId.startsWith('embedModal-')) {
            return this.some();
        }
        return this.none();
    }

    async run(interaction) {
        const channelId = interaction.customId.split('-')[1];
        const channel = await interaction.guild.channels.fetch(channelId);

        const title = interaction.fields.getTextInputValue('embedTitle');
        const description = interaction.fields.getTextInputValue('embedDescription');

        // if channel is not a text channel
        if (!channel || channel.type !== 0) { 
            return interaction.reply({ content: 'Le salon sélectionné n\'est pas un salon de texte.', ephemeral: MessageFlags.Ephemeral   });
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor('#0099ff');

        channel.send({ embeds: [embed] });
        return interaction.reply({ content: 'Embed envoyé avec succès !', ephemeral: MessageFlags.Ephemeral });
    }

}

module.exports = {
    EmbedInteractionHandler
};