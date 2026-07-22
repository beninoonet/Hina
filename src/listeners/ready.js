const { Listener } = require('@sapphire/framework');

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
        
    }

}
module.exports = {
  ReadyListener
};