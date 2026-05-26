const { SapphireClient, ApplicationCommandRegistries } = require('@sapphire/framework');
const { GatewayIntentBits, Partials } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

ApplicationCommandRegistries.setDefaultGuildIds([process.env.GUILD_ID]);

const client = new SapphireClient({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent, 
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
        Partials.GuildMember,
        Partials.User

    ],
    baseUserDirectory: __dirname,
    loadMessageCommandListeners: true,
    loadApplicationCommandRegistriesStatusListeners: true
 });

client.login(process.env.BOT_TOKEN);
