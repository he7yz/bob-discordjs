const {SlashCommandBuilder, MessageFlags} = require('discord.js');
const captcha = require('../functions/captcha.js');

module.exports = {
  data : new SlashCommandBuilder()
  .setName('verify')
  .setDescription('Authenticate captcha to access MMUCraft!'),
  async execute (interaction) {
    
    await interaction.reply({ content: `<:clock:1426655735814815755> Verification Process Initialized.`, flags: MessageFlags.Ephemeral});

    await captcha("random", interaction, interaction.user);

    var cache = interaction.client.cache.get(interaction.id);
    while (!cache){
      cache = await interaction.client.cache.get(interaction.id);
      await new Promise(resolve => setTimeout(resolve,1000));
    }
    await interaction.client.cache.delete(interaction.id);
    await interaction.editReply("<:netherstar:1426641072653598761> Approved from Captcha ദ്ദി ( ᵔ ᗜ ᵔ )");

    const member = await interaction.guild.members.fetch(interaction.user.id);
    await member.roles.add("1415363731176554648");

    await interaction.followUp({content:`<:netherstar:1426641072653598761> Welcome To MMUCraft, ${interaction.user}! <:MMUCRAFT:1417945712594915338>`, flags: MessageFlags.Ephemeral});

  }
}
