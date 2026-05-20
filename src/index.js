const { SapphireClient, ApplicationCommandRegistries } = require('@sapphire/framework');
const { GatewayIntentBits } = require('discord.js');
const { Shoukaku, Connectors } = require('shoukaku');
const dotenv = require('dotenv');
dotenv.config();


ApplicationCommandRegistries.setDefaultGuildIds([process.env.GUILD_ID]);

const client = new SapphireClient({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
    ],
    loadMessageCommandListeners: true,
    loadApplicationCommandRegistriesStatusListeners: true
 });

client.ws.on('VOICE_STATE_UPDATE', () => {});
client.ws.on('VOICE_SERVER_UPDATE', () => {});

const nodes = [
  {
    name: 'main',
    url: '127.0.0.1:2333',
    auth: 'youshallnotpass'
  }
];

// 💥 INIT ICI (IMPORTANT)
client.shoukaku = new Shoukaku(
  new Connectors.DiscordJS(client),
  nodes
);

client.on('raw', (p) => {
  if (p.t?.includes('VOICE')) console.log('VOICE EVENT:', p.t);
});

client.login(process.env.BOT_TOKEN);
