const { EmbedBuilder } = require('discord.js');

module.exports = {
  trigger: 'sudo levelEmbed',
  execute(message) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: "Leveling & Rewards System",
        url: "https://example.com",
        iconURL: "https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/00/Experience_Orb_Value_17-36.png/revision/latest?cb=20200216163127",
      })
      .setURL("https://example.com")
      .setDescription("TEST\nTES\nTE\nT\nTE\nTET\nTETO")
      .addFields(
      {
        name: "ExplanationTest",
        value: "@Creeper 5 - Iron x8 + Bread x16 + 5 exp levels\n@Drowned 10 - Increased Land Claim [100 blocks] + Emeralds x16 + 5 exp levels\n@Phantom 15 -  \n@Enderman 20 - Increased Land Claim\n@Breeze 25 - Breeze Rods x4\n@Creaking 30 - Increased Land Claim\n@Blaze 35 -\n@Ghast 40 - Increased Land Claim\n@Wither Skeleton 45 - \n@Evoker 50 - Increased Land Claim + Netherite Ingot x2 + Notch Apple\n@Brute 60 - \n@Elder Guardian 70 - Increased Land Claim + Netherite Ingot x2 + Conduit\n@Warden 80 - \n@Wither 90 - Increased Land Claim + Netherite Ingot x2 + Conduit\n@Ender Dragon 100 - Elytra + NUKE\n\n\ntest",
        inline: false
      },
      {
        name: "Level 5 - Creeper",
        value: "CREEPER AW MAN \nso we back in the mine",
        inline: false
      },
      {
        name: "Level 10 - Drowned",
        value: "test",
        inline: false
      },
      {
        name: "Level 15 - uhh i forgot",
        value: "yea",
        inline: false
      },
    )
    .setImage("https://media1.tenor.com/m/QFrrj-Of70gAAAAd/spear-minecraft-meme-funny-minecraft-spear-update-meme.gif")
    .setThumbnail("https://i.redd.it/c1jh6o32v0if1.jpeg")
    .setColor("#ffffff")
    .setFooter({
      text: "MMUCraft Discord",
      iconURL: "https://images-ext-1.discordapp.net/external/WtkqHMdnLHEjSElPSXl-ByvwPLrYRMdwh5GPHkUjQvw/%3Fsize%3D96/https/cdn.discordapp.com/emojis/1415316601976393788.webp?format=png",
    })
    .setTimestamp();
      message.channel.send({ embeds : [embed] });
  }
};
