const { Listener } = require('@sapphire/framework');

const { supabase } = require('../lib/supabase');

const dotenv = require('dotenv');
dotenv.config();



class ReadyListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      once: true,
      event: 'ready'
    });
  }

    async run(client) {
        const {username, id} = client.user;
        // Informe dans la console que le bot est connecté et prêt à fonctionner
        this.container.logger.info(`Connected as ${username} (${id})!`);

        client.user.setActivity('On progress', { type: 1, url: process.env.TWITCH_LINK }); // Type 1 is "Streaming
        client.user.setStatus('idle'); // Met le statut du bot sur "idle"

        // Envoie un message dans le canal spécifié pour indiquer que le bot est prêt
        const channel = await client.channels.fetch(process.env.READY_CHANNEL_ID);
        if (channel) {
            await channel.send('Bot is ready!');
        } else {
            this.container.logger.error('Ready channel not found!');
        }

        // Supabase DB
        const guilds = this.container.client.guilds.cache.map((guild) => ({
            id: guild.id,
            name: guild.name,
            member_count: guild.memberCount,
            joined_at: new Date().toISOString(),
            owner_id: guild.ownerId,
            created_at: new Date().toISOString(),
        }));

        const { error } = await supabase
            .from('guilds')
            .upsert(guilds, { onConflict: 'id' });
        if (error) {
            this.container.logger.error(`ReadyListener: Failed to upsert guilds into database: ${error.message}`);
        } else {
            this.container.logger.info(`ReadyListener: Successfully upserted guilds into database.`);
        }

    }

}
module.exports = {
  ReadyListener
};