module.exports = {
  channelId: '1448721985155891343',
  execute(message) {

    if (message.channel.id === this.channelId) {
      if (message.author.bot) return;

      const rename_buttonID = 'rename_threadButton';
      const renameButton = {
        type: 2,
        custom_id: rename_buttonID,
        style: 1,
        label: 'Edit Title',
        emoji: {
          id: '1448744262635229274',
          name: 'whitepencil'
        }
      };

      const actionRow = {
        type: 1,
        components: [renameButton],
      };

      message.startThread({
        name: `${message.author.username}'s Art Piece!`,
        autoArchiveDuration: 10080, 
        reason: 'Auto-thread and react creation by a sent message in #arts cannel'
      })
      .then(thread => {
        thread.send({
          content: `Thread created for the art posted by ${message.author.toString()}! Feel free to edit the title of this art by clicking the button below (˶˃ ᵕ ˂˶)`,
          components: [actionRow]
        })
          .catch(err => console.log('[AutoThreadReactor] Failed to send message in the thread:', err));

          message.react(':heart:1426639169693683905')
            .catch(err => console.log('[AutoThreadReactor] Failed to add reactions:', err));
      })
      .catch(err => console.log('[AutoThreadReactor] Failed to create thread:', err));
    }
  },

  async handleInteraction(interaction) {
    const { 
      TextInputBuilder, 
      TextInputStyle, 
      ModalBuilder, 
      ActionRowBuilder 
    } = require('discord.js');
    
    if (interaction.isButton() && interaction.customId === 'rename_threadButton') {
      const modal = new ModalBuilder()
        .setCustomId('renameThreadModal')
        .setTitle('Edit Thread Title');

      const titleInput = new TextInputBuilder()
        .setCustomId('newThreadTitle')
        .setLabel('New Artwork Title')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Enter the new title for this thread')
        .setRequired(true)
        .setMaxLength(100);

      const actionRow = new ActionRowBuilder().addComponents(titleInput);
      modal.addComponents(actionRow);

      await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'renameThreadModal') {
      const newTitle = interaction.fields.getTextInputValue('newThreadTitle');
      
      try {
        await interaction.channel.setName(newTitle);
        await interaction.reply({
          content: `Art Title renamed to: **${newTitle}**! ദ്ദി ˉ꒳ˉ )✧`,
        });
      } catch (error) {
        console.error('[AutoThreadReactor] Failed to rename thread:', error);
        await interaction.reply({
          content: 'For some reason, I failed to update the Art Title... (ᵕ—ᴗ—)',
        });
      }
    }
  }
};
