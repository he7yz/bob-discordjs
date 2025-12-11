require('dotenv').config();

const Discord = require("discord.js");
const fs = require('fs');
const path = require('path');
const Welcomer = require('./events/welcomer.js');

const client = new Discord.Client({intents: [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,
  Discord.GatewayIntentBits.MessageContent,
  Discord.GatewayIntentBits.GuildMembers,
  Discord.GatewayIntentBits.GuildPresences,
]});

client.cooldowns = new Map();
client.cache = new Map();

require('./utilities/ComponentsLoader.js')(client);
require('./utilities/SlashCommands.js')(client);
// console.log(process.env);

const messageCommands = new Map();
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

let autoDeleterHandler = null;

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.trigger) {
    messageCommands.set(event.trigger, event);
  }
  if (event.channelId) {
    autoDeleterHandler = event;
  }
}

function discordRPCstatus() {
  const guild = client.guilds.cache.get('1415012956038627541');
  const userCount = guild ? guild.memberCount : 0;

  
  client.user.setActivity({
    name:`${userCount - 3} Players in MMUCraft`,
    type: Discord.ActivityType.Watching,
    state: "minecraft.mmu.edu.my",
    details: "MMUCraft",
  });
}

client.once("clientReady", () => {
  console.log(`${client.user.tag} is up and ready!`);

  discordRPCstatus();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  
  if (!command) {
    console.log(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing ${interaction.commandName}:`, error);
    
    const errorMessage = { content: 'Error occured while executing this command.', flags: MessageFlags.Ephemeral  };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (autoDeleterHandler) {
    autoDeleterHandler.execute(message);
  }
  
  const command = messageCommands.get(message.content);
  if (command) {
    try {
      command.execute(message);
    } catch (error) {
      console.error(`Error executing ${message.content}:`, error);
    }
  }
});

client.on('guildMemberAdd', async (member) => {
  try {
    const welcomeChannel = member.guild.channels.cache.get('1415358335540002988');
    
    if (!welcomeChannel) return;

    const welcomer = new Welcomer()
      .setName(member.user.username)
      .setDiscriminator(`Player #${member.guild.memberCount - 3}`)
      .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 1024 }))
      .setGif(false);

    const image = await welcomer.generate();

    await welcomeChannel.send({
      content: `${member} **has joined the world!**`,
      files: [{
        attachment: image,
        name: 'Welcome_To_MMUCraft.png'
      }]
    });
  } catch (error) {
    console.error('[Welcomer] Event broke. =>', error);
  }

  discordRPCstatus();

});

client.on('guildMemberRemove', (member) => {
  discordRPCstatus();
});

client.login(process.env.BOB_TOKEN);
