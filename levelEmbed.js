const { EmbedBuilder } = require('discord.js');

module.exports = {
  trigger = 'sudo levelEmbed',
  execute(message) {
    const embed = new embedBuilder();
      .setAuthor({
        name: "Leveling & Rewards System!"
        url:
        iconURL:
      })
      .setDescription("Climb up the Ranks and be rewarded handsomely!")
      .setColor("#ffffff")
      .setFooter({
        text: "MMUCraft Discord";
        iconURL: "link";
      });
    message.channel.send({ embeds : [embed] });
  }
};
