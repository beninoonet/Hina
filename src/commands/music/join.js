const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');


class JoinCommand extends Command {
  constructor(context, options) {
    super(context, { ...options });
  }

  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('join')
        .setDescription('Rejoint le canal vocal où tu es connecté')
    );
  }

  async chatInputRun(interaction) {
  }

  async chatInputRun(interaction) {
const voice = interaction.member.voice.channel;

if (!voice) {
  return interaction.reply("❌ Tu dois être en vocal.");
}

await interaction.deferReply();

const existing = interaction.client.shoukaku.players.get(interaction.guild.id);

if (existing) {
  await existing.destroy().catch(() => {});
}

// 🔥 DISCORD STABILIZATION DELAY
await new Promise(r => setTimeout(r, 1000));

try {
  const player = await interaction.client.shoukaku.joinVoiceChannel({
    guildId: interaction.guild.id,
    channelId: voice.id
  });

  return player;

} catch (err) {
  console.error("VOICE JOIN ERROR:", err);

  return interaction.followUp(
    "❌ Discord refuse le join vocal (timeout handshake)."
  );
}
    }
        }
module.exports = {
  JoinCommand
};