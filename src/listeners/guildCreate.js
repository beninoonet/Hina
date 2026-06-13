const { Listener, Events } = require('@sapphire/framework');

const { supabase } = require('../lib/supabase');

class GuildCreateListener extends Listener {
    constructor(context, options) {
        super(context, {    
            ...options,
            event: Events.GuildCreate
        });
    } 

    async run(guild) {
        const { error } = await supabase
            .from('guilds')
            .insert({
                id: guild.id,
                name: guild.name,
                member_count: guild.memberCount,
                joined_at: new Date().toISOString(),
                active: true,
                owner_id: guild.ownerId
            });

            if (error) {
                this.container.logger.error(`GuildCreateListener: Failed to insert guild ${guild.id} into database: ${error.message}`);
                return;
            }

            this.container.logger.info(`GuildCreateListener: Successfully inserted guild ${guild.id} into database.`);
        }
    }

module.exports = { GuildCreateListener };