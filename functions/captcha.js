const path = require('path');
const {CaptchaGenerator} = require('captcha-canvas'); //need to install package beforehand via. npm
const Canvas = require('canvas');

const MonocraftFont = path.join(__dirname, '../fonts/Monocraft.ttf');
Canvas.registerFont(MonocraftFont, {family: 'Monocraft'});



const {
  Events,
  AttachmentBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionCollector,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  MessageFlags
} = require('discord.js'); 

async function captcha(text, toReply, author) {
  if (!text) throw new Error("No Text Provided. Use `random` for a random string: captcha(text, toReply, author)");
  if (!toReply) throw new Error("No Valid Method Provided to reply to: captcha(text, toReply {either message/interaction obj.}, author)");
  if (!author) throw new Error("No Valid USER component: captcha(text, toReply, author);");
  
  var output = false;

  var capText = "";
  if (text.toLowerCase() == "random") {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    var outputString = "";
    for (let i = 0; i < 6; i++) {
      outputString += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    capText =outputString;
  } else capText =text;

  const captcha = new CaptchaGenerator()
  .setDimension(200,800)
  .setCaptcha({ text: capText, size: 60, color: "#00FF00", font: 'Monocraft'})
  .setDecoy({ opacity: 0.5})
  .setTrace({ color: "#00FF00"})
  .generateSync()

  const captchaBuffer = Buffer.from(captcha);
  const attachment = new AttachmentBuilder(captchaBuffer, { name: "captcha.png"});

  const embed = new EmbedBuilder()
  .setAuthor({ 
    name: 'Captcha Verification', 
    iconURL: 'https://wiki.hypixel.net/images/1/10/SkyBlock_items_enchanted_eye_of_ender.gif'
  })
  .setColor("#170c63")
  .setImage('attachment://captcha.png')
  .setDescription(`<:hardcoreheart:1426657947009679497> ${author}, you must solve the captcha to get access into MMUCraft! **Keep in mind, it is case-sensitive!**`)
  .setTimestamp()
  .setFooter({
    text: 'MMUCraft Discord', 
    iconURL: 'https://cdn.discordapp.com/emojis/1415316601976393788.webp?size=96' 
  });

  const button = new ActionRowBuilder()
  .setComponents(
    new ButtonBuilder()
    .setCustomId('captchabutton')
    .setLabel(`💭 Solve Captcha`)
    .setStyle(ButtonStyle.Danger),
  );

  var msg = await toReply.channel.send({ 
    embeds: [embed],
    files: [attachment],
    components: [button],
    flags: MessageFlags.Ephemeral
  });

  setTimeout(async () => {
    if (!output) {
    await msg.delete().catch(err => console.log('Captcha message deleted due to inactivity.')); 

    await toReply.followUp({content: `<:witheredheart:1426639604030902283> Captcha verification period expired. Please try again.`, flags: MessageFlags.Ephemeral });

    collector.stop('timeout');
    modalCollector.stop('timeout');
    }
  }, 60000);

  const collector = new InteractionCollector(toReply.client, { message: msg, time: 600000});
  const modalCollector = new InteractionCollector(toReply.client);

  collector.on("collect", async i => {
    if (i.customId == "captchabutton"){
      if (author !== i.user ) return await i.reply({ content: `<:mace:1426654675674857592> Only ${author.username} can use this.`, flags: MessageFlags.Ephemeral});

      const capModal = new ModalBuilder()
      .setTitle("Verify Your Captcha Answer")
      .setCustomId(`captchamodal`);

      const answer = new TextInputBuilder()
      .setCustomId("captchaanswer")
      .setLabel("Your Captcha Answer")
      .setPlaceholder("Submit the captcha given. If you got it wrong, skill issue")
      .setStyle(TextInputStyle.Short);

      const row = new ActionRowBuilder().addComponents(answer);
      capModal.addComponents(row);
      await i.showModal(capModal);

      modalCollector.on('collect', async mI =>{
        if (mI.customId !== "captchamodal") return;
        const respondAns = mI.fields.getTextInputValue("captchaanswer");

        if (respondAns != capText) {
          return await mI.reply({ content: `<:witheredheart:1426639604030902283> That was wrong! Try again`, flags: MessageFlags.Ephemeral}).catch(err => {});
        } else {
          await mI.reply({ content: `<:mace:1426654675674857592> Verifying that you aren't a mob...`, flags: MessageFlags.Ephemeral }).catch(err => {});
          await msg.delete().catch(err => {});
          output = true;
        }
      });
    }
  });

  while (!output) {
    await new Promise(resolve => setTimeout(resolve,100 ));
  }
  await toReply.client.cache.set(`${toReply.id}`, true);
  await modalCollector.stop();
  await collector.stop();
};

module.exports = captcha;
