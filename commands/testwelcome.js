const { SlashCommandBuilder } = require('discord.js');
const Welcomer = require('../events/welcomer.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testwelcome')
    .setDescription('system call: generato discordo elemento, irrashaimase testo'),
    
  async execute(interaction) {
    await interaction.deferReply();
    
    try {
      const welcomer = new Welcomer()
        .setName(interaction.user.username)
        .setDiscriminator(`Player #${interaction.guild.memberCount - 2}`)
        .setAvatar(interaction.user.displayAvatarURL({ extension: 'png', size: 1024 }))
        .setGif(false);

      const image = await welcomer.generate();

      await interaction.editReply({
        content: `hi ${interaction.user} UwU`,
        files: [{
          attachment: image,
          name: 'welcome.png'
        }]
      });
    } catch (error) {
      console.error('welcomer tester broke =>', error);
      await interaction.editReply('image gen error');
      
    }
  }
};
