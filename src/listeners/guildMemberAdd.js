const { Listener } = require('@sapphire/framework');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const { AttachmentBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

class guildMemberAddListener extends Listener {
  constructor(context, options) {
    super(context, {
      ...options,
      once: false,
      event: 'guildMemberAdd'
    });
  }

    async run(member) {
            console.log('avatarURL:', member.user.displayAvatarURL({ extension: 'png', size: 512 }));
            console.log('username:', member.user.username);
            console.log('memberCount:', member.guild.memberCount);

            if (member.partial) {
                try {
                    await member.fetch();
                } catch (error) {
                    console.error('Error fetching member:', error);
                    return;
                }
            }
        // Generate a canvas
              const canvas = createCanvas(700, 250);
              const ctx = canvas.getContext('2d');
      
              // Load a gradient background
              const gradient = ctx.createLinearGradient(0, 0, 700, 250)
              gradient.addColorStop(0, '#2e2637');
              gradient.addColorStop(1, '#25242c');
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              ctx.save(); // Save the current state before clipping

              // Border of avatar
              ctx.beginPath();
              ctx.arc(125, 125, 75, 0, Math.PI * 2);
              ctx.lineWidth = 6;
              ctx.stroke();
              ctx.clip(); // around avatar
      
              // Load avatar
              const avatarURL = member.user.displayAvatarURL({ extension: 'png', size: 512 }) ?? member.user.defaultAvatarURL;
              const avatar = await loadImage(avatarURL);
              ctx.drawImage(avatar, 50, 50, 150, 150);
      
              // Reset clipping to draw text
              ctx.restore();
      
              // Text
          ctx.font = 'bold 42px Montserrat';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(`Bienvenue !`, 240, 100);

          ctx.font = 'semi-bold 36px Montserrat';
          ctx.fillStyle = '#bcbcbc';
          ctx.fillText('@' + member.user.username, 240, 145);

          ctx.font = '26px Montserrat';
          ctx.fillStyle = '#b9acff';
          ctx.fillText(`Membre #${member.guild.memberCount}`, 240, 185);
              // Create attachment and send
          const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'welcome.png' });
      

        member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID)?.send({ 
            content: `Bienvenue ${member} sur le serveur !`,
            files: [attachment] 
        });
        this.container.logger.info(`Member joined: ${member.user.tag}`);

        // Ignore les bots pour le comptage des membres
        if (member.user.bot) {
            this.container.logger.info(`Un bot (${member.user.tag}) a rejoint le serveur.`);
            return;
        }
  }
}


module.exports = {
  guildMemberAddListener
};
        
