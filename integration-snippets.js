// ═══════════════════════════════════════════════════════════════
// 🎨 GRAPHICS ENHANCEMENT - READY-TO-USE CODE SNIPPETS
// ═══════════════════════════════════════════════════════════════
// Copy these snippets into your index.js to add beautiful graphics!

// ═══════════════════════════════════════════════════════════════
// 📦 STEP 1: ADD THESE IMPORTS AT THE TOP OF index.js
// ═══════════════════════════════════════════════════════════════

import {
  createAIResponseEmbed,
  createSuccessEmbed,
  createErrorEmbed,
  createWarningEmbed,
  createInfoEmbed,
  createConfigEmbed,
  createMemoryEmbed,
  createModActionEmbed,
  createPersonalityButtons,
  COLORS,
  EMOJIS,
  formatDuration,
  createProgressBar
} from './graphics-utils.js';

import {
  createMainCommandsEmbed,
  createCategoryEmbed,
  createCategoryButtons,
  createQuickHelpButtons,
  createQuickChatHelp,
  createQuickPersonalityHelp,
  createQuickModerationHelp,
  createQuickConfigHelp,
  COMMAND_CATEGORIES
} from './commands-display.js';

// ═══════════════════════════════════════════════════════════════
// 🎮 STEP 2: ADD BUTTON INTERACTION HANDLER
// ═══════════════════════════════════════════════════════════════
// Add this AFTER your existing interaction handlers

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton() && !interaction.isStringSelectMenu()) return;

  try {
    const { customId } = interaction;

    // ═══════════════════════════════════════════════
    // 📋 Category Navigation Buttons
    // ═══════════════════════════════════════════════
    if (customId.startsWith('cat_')) {
      const category = customId.replace('cat_', '');
      const embed = createCategoryEmbed(category);
      const buttons = createCategoryButtons();
      
      await interaction.update({
        embeds: [embed],
        components: buttons
      });
      return;
    }

    // ═══════════════════════════════════════════════
    // 🏠 Home Button
    // ═══════════════════════════════════════════════
    if (customId === 'commands_home') {
      const mainEmbed = createMainCommandsEmbed();
      const buttons = createCategoryButtons();
      const quickHelp = createQuickHelpButtons();
      
      await interaction.update({
        embeds: [mainEmbed],
        components: [...buttons, quickHelp]
      });
      return;
    }

    // ═══════════════════════════════════════════════
    // 📖 View All Commands
    // ═══════════════════════════════════════════════
    if (customId === 'commands_all') {
      const allEmbed = createAllCommandsEmbed();
      const backButton = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('commands_home')
            .setLabel('Back to Menu')
            .setEmoji('🏠')
            .setStyle(ButtonStyle.Secondary)
        );
      
      await interaction.update({
        embeds: [allEmbed],
        components: [backButton]
      });
      return;
    }

    // ═══════════════════════════════════════════════
    // 💬 Quick Help Buttons
    // ═══════════════════════════════════════════════
    if (customId === 'quick_chat') {
      const embed = createQuickChatHelp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }
    
    if (customId === 'quick_personality') {
      const embed = createQuickPersonalityHelp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }
    
    if (customId === 'quick_moderation') {
      const embed = createQuickModerationHelp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }
    
    if (customId === 'quick_config') {
      const embed = createQuickConfigHelp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    // ═══════════════════════════════════════════════
    // 🎭 Personality Change Buttons
    // ═══════════════════════════════════════════════
    if (customId.startsWith('personality_')) {
      const guildId = interaction.guildId;
      const mode = customId.replace('personality_', '');
      
      if (!isModOrAdmin(interaction.member, guildId)) {
        const embed = createErrorEmbed(
          'Permission Denied',
          'Only moderators and admins can change the bot personality.',
          'Ask a server administrator for help.'
        );
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      const config = getServerConfig(guildId);
      const oldMode = config.personality;
      config.personality = mode;
      saveConfig(guildId, config);

      const embed = createSuccessEmbed(
        'Personality Updated!',
        `Mai is now in **${mode}** mode! 🎭`,
        [
          { name: 'Previous Mode', value: oldMode, inline: true },
          { name: 'New Mode', value: mode, inline: true }
        ]
      );

      await interaction.reply({ embeds: [embed] });
      return;
    }

    // ═══════════════════════════════════════════════
    // 📋 Category Select Menu
    // ═══════════════════════════════════════════════
    if (customId === 'commands_category_select') {
      const selectedValue = interaction.values[0];
      const category = selectedValue.replace('category_', '');
      const embed = createCategoryEmbed(category);
      const buttons = createCategoryButtons();
      
      await interaction.update({
        embeds: [embed],
        components: buttons
      });
      return;
    }

  } catch (error) {
    console.error('Error handling button interaction:', error);
    const embed = createErrorEmbed(
      'Interaction Error',
      'Something went wrong while processing your request.',
      'Please try again or contact support.'
    );
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [embed], ephemeral: true });
    } else {
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
});

// ═══════════════════════════════════════════════════════════════
// 🔄 STEP 3: REPLACE YOUR EXISTING SLASH COMMAND HANDLERS
// ═══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════
// 📋 /commands - Interactive Command Menu
// ══════════════════════════════════════════
// FIND your existing /commands handler and REPLACE with:

if (commandName === 'commands') {
  const mainEmbed = createMainCommandsEmbed();
  const buttons = createCategoryButtons();
  const quickHelp = createQuickHelpButtons();
  
  await interaction.reply({
    embeds: [mainEmbed],
    components: [...buttons, quickHelp],
    ephemeral: true
  });
  return;
}

// ══════════════════════════════════════════
// ⚙️ /config - Configuration Display
// ══════════════════════════════════════════
// FIND your existing /config handler and REPLACE with:

if (commandName === 'config') {
  const guildId = interaction.guildId;
  const config = getServerConfig(guildId);
  const embed = createConfigEmbed(interaction.guild.name, config);
  
  await interaction.reply({ embeds: [embed] });
  return;
}

// ══════════════════════════════════════════
// 🧠 /memory - Memory Display
// ══════════════════════════════════════════
// FIND your existing /memory handler and REPLACE with:

if (commandName === 'memory') {
  const guildId = interaction.guildId;
  const memories = memory[guildId] || {};
  const embed = createMemoryEmbed(interaction.guild.name, memories);
  
  await interaction.reply({ embeds: [embed] });
  return;
}

// ══════════════════════════════════════════
// 🎭 /personality - Personality Selector
// ══════════════════════════════════════════
// FIND your existing /personality handler and REPLACE with:

if (commandName === 'personality') {
  const guildId = interaction.guildId;
  const mode = interaction.options.getString('mode');

  if (!isModOrAdmin(interaction.member, guildId)) {
    const embed = createErrorEmbed(
      'Permission Denied',
      'Only moderators and admins can change the bot personality.',
      'Ask a server administrator for help.'
    );
    await interaction.reply({ embeds: [embed], ephemeral: true });
    return;
  }

  if (!mode) {
    // Show personality picker
    const embed = new EmbedBuilder()
      .setColor(COLORS.PERSONALITY)
      .setTitle(`${EMOJIS.PERSONALITY} Choose Mai's Personality`)
      .setDescription('Click a button below to change how Mai responds!')
      .addFields(
        { name: '💬 Normal', value: 'Friendly and helpful', inline: true },
        { name: '🎭 Shakespearean', value: 'Eloquent and dramatic', inline: true },
        { name: '🌸 Anime', value: 'Kawaii and enthusiastic', inline: true },
        { name: '🏴‍☠️ Pirate', value: 'Arr, matey!', inline: true },
        { name: '🎩 Formal', value: 'Professional', inline: true },
        { name: '🔥 Gen Z', value: 'No cap, fr fr', inline: true },
        { name: '🇮🇳 Hinglish', value: 'Mix of Hindi & English', inline: true },
        { name: '🥺 UwU', value: 'Super cute', inline: true },
        { name: '🤠 Southern', value: 'Y\'all and howdy', inline: true },
        { name: '🦘 Aussie', value: 'G\'day mate!', inline: true },
        { name: '🔥 Roast', value: 'Savage mode', inline: true }
      )
      .setFooter({ text: 'Click a button to activate that personality!' });
    
    const buttons = createPersonalityButtons();
    
    await interaction.reply({
      embeds: [embed],
      components: buttons,
      ephemeral: true
    });
    return;
  }

  const config = getServerConfig(guildId);
  const oldMode = config.personality;
  config.personality = mode;
  saveConfig(guildId, config);

  const embed = createSuccessEmbed(
    'Personality Updated!',
    `Mai is now in **${mode}** mode! 🎭`,
    [
      { name: 'Previous Mode', value: oldMode, inline: true },
      { name: 'New Mode', value: mode, inline: true }
    ]
  );

  await interaction.reply({ embeds: [embed] });
  return;
}

// ══════════════════════════════════════════
// ⚠️ /warn - Warning Command
// ══════════════════════════════════════════
// FIND your existing /warn handler and UPDATE the response:

if (commandName === 'warn') {
  // ... your existing permission checks and logic ...

  // REPLACE the success message with:
  const embed = createModActionEmbed(
    'warn',
    targetUser,
    interaction.user,
    reason
  );
  
  // Add warning count
  embed.addFields({
    name: `${EMOJIS.STATS} Warning Count`,
    value: `This is warning #${warningCount} for this user`,
    inline: false
  });

  await interaction.reply({ embeds: [embed] });
  
  // If logging to mod channel:
  if (modLogChannel) {
    await modLogChannel.send({ embeds: [embed] });
  }
  
  return;
}

// ══════════════════════════════════════════
// 🔇 /mute - Mute Command
// ══════════════════════════════════════════
// FIND your existing /mute handler and UPDATE the response:

if (commandName === 'mute') {
  // ... your existing logic ...

  const embed = createModActionEmbed(
    'mute',
    targetUser,
    interaction.user,
    reason,
    duration // e.g., "10 minutes"
  );

  await interaction.reply({ embeds: [embed] });
  
  if (modLogChannel) {
    await modLogChannel.send({ embeds: [embed] });
  }
  
  return;
}

// ══════════════════════════════════════════
// 👢 /kick - Kick Command
// ══════════════════════════════════════════
// UPDATE the response:

if (commandName === 'kick') {
  // ... your existing logic ...

  const embed = createModActionEmbed(
    'kick',
    targetUser,
    interaction.user,
    reason
  );

  await interaction.reply({ embeds: [embed] });
  
  if (modLogChannel) {
    await modLogChannel.send({ embeds: [embed] });
  }
  
  return;
}

// ══════════════════════════════════════════
// 🔨 /ban - Ban Command
// ══════════════════════════════════════════
// UPDATE the response:

if (commandName === 'ban') {
  // ... your existing logic ...

  const embed = createModActionEmbed(
    'ban',
    targetUser,
    interaction.user,
    reason
  );

  if (deleteDays > 0) {
    embed.addFields({
      name: `${EMOJIS.INFO} Message Deletion`,
      value: `Messages from last ${deleteDays} day(s) will be deleted`,
      inline: false
    });
  }

  await interaction.reply({ embeds: [embed] });
  
  if (modLogChannel) {
    await modLogChannel.send({ embeds: [embed] });
  }
  
  return;
}

// ═══════════════════════════════════════════════════════════════
// 🔄 STEP 4: UPDATE AI RESPONSE MESSAGES
// ═══════════════════════════════════════════════════════════════

// FIND where you send AI responses (in messageCreate handler)
// LOOK FOR something like: await message.reply(aiResponse);
// REPLACE with:

const embed = createAIResponseEmbed(
  aiResponse,
  config.personality,
  message.author.username
);
await message.reply({ embeds: [embed] });

// ═══════════════════════════════════════════════════════════════
// ⚠️ STEP 5: UPDATE ERROR MESSAGES
// ═══════════════════════════════════════════════════════════════

// EXAMPLE: Rate limit message
// REPLACE: await message.reply(`You're being rate limited...`);
// WITH:
const embed = createWarningEmbed(
  'Rate Limit Reached',
  `You're sending messages too quickly! Please wait ${secondsLeft} seconds before trying again.`
);
await message.reply({ embeds: [embed] });

// EXAMPLE: Permission denied
// REPLACE: await interaction.reply("You don't have permission");
// WITH:
const embed = createErrorEmbed(
  'Permission Denied',
  'You need moderator or admin permissions to use this command.',
  'Ask a server administrator to grant you the required role.'
);
await interaction.reply({ embeds: [embed], ephemeral: true });

// EXAMPLE: Bot disabled
// REPLACE: await message.reply("Bot is disabled");
// WITH:
const embed = createErrorEmbed(
  'Bot Disabled',
  'Mai is currently disabled in this server.',
  'An administrator can enable it using `/enable-bot`'
);
await message.reply({ embeds: [embed] });

// ═══════════════════════════════════════════════════════════════
// ✅ STEP 6: UPDATE SUCCESS MESSAGES
// ═══════════════════════════════════════════════════════════════

// EXAMPLE: Setting saved
// REPLACE: await interaction.reply("✅ Settings saved!");
// WITH:
const embed = createSuccessEmbed(
  'Settings Saved',
  'Your configuration has been updated successfully!'
);
await interaction.reply({ embeds: [embed] });

// EXAMPLE: Filter enabled
// REPLACE: await interaction.reply("NSFW filter enabled");
// WITH:
const embed = createSuccessEmbed(
  'NSFW Filter Enabled',
  'The NSFW content filter is now active.',
  [
    { name: 'Status', value: '🛡️ Protected', inline: true },
    { name: 'Changed by', value: interaction.user.tag, inline: true }
  ]
);
await interaction.reply({ embeds: [embed] });

// ═══════════════════════════════════════════════════════════════
// 💡 BONUS: PROGRESS BAR EXAMPLE
// ═══════════════════════════════════════════════════════════════

// Show rate limit status
const rateLimitInfo = checkRateLimit(userId);
const progressBar = createProgressBar(rateLimitInfo.remaining, rateLimitInfo.total);

const embed = new EmbedBuilder()
  .setColor(COLORS.INFO)
  .setTitle(`${EMOJIS.INFO} Rate Limit Status`)
  .addFields({
    name: 'Remaining Messages',
    value: progressBar,
    inline: false
  });

// ═══════════════════════════════════════════════════════════════
// 💡 BONUS: TIMESTAMP FORMATTING
// ═══════════════════════════════════════════════════════════════

import { formatTimestamp } from './graphics-utils.js';

// Show when something expires
const muteUntil = Date.now() + (10 * 60 * 1000); // 10 minutes from now
const timestamp = formatTimestamp(muteUntil, 'R'); // Relative

embed.addFields({
  name: 'Mute Expires',
  value: timestamp, // Shows as "in 10 minutes"
  inline: true
});

// ═══════════════════════════════════════════════════════════════
// 🎉 YOU'RE DONE!
// ═══════════════════════════════════════════════════════════════
// Your bot now has beautiful graphics and interactive elements!
// Test it out and enjoy the upgraded experience! ✨
