// ═══════════════════════════════════════════════
// 📚 COMMANDS DISPLAY SYSTEM
// ═══════════════════════════════════════════════
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';

const COMMAND_CATEGORIES = {
  chat: {
    name: '💬 Chat & AI',
    emoji: '💬',
    commands: [
      { name: '/chat <message>', desc: 'Chat with Mai' },
      { name: '@Mai <message>', desc: 'Alternative way to chat' },
      { name: '/memory', desc: 'View server memory' },
      { name: '/forget', desc: 'Clear channel history' },
    ]
  },
  levels: {
    name: '📊 Leveling System',
    emoji: '📊',
    commands: [
      { name: '/rank [user]', desc: 'Check level and XP' },
      { name: '/leaderboard [page]', desc: 'View XP leaderboard' },
      { name: '/toggle-levelup-mention <on/off>', desc: 'Toggle level up mentions for yourself' },
      { name: '/level-toggle <on/off>', desc: '🔒 Enable/disable leveling' },
      { name: '/level-config', desc: '🔒 Configure XP rates and settings' },
      { name: '/level-channel [channel]', desc: '🔒 Set dedicated level-up channel' },
      { name: '/xp-boost <action> <bonus>', desc: '🔒 Set bonus XP for actions' },
      { name: '/no-xp-channel <add/remove> [channel]', desc: '🔒 Manage no-XP channels' },
      { name: '/no-xp-role <add/remove> [role]', desc: '🔒 Manage no-XP roles' },
      { name: '/add-role-reward', desc: '🔒 Add role reward (Arcane-style)' },
      { name: '/remove-role-reward <level>', desc: '🔒 Remove role reward' },
      { name: '/list-role-rewards', desc: 'View all role rewards' },
      { name: '/set-level <user> <level>', desc: '🔒 Set user level' },
      { name: '/reset-xp <user>', desc: '🔒 Reset user XP' },
      { name: '/reset-all-xp', desc: '🔒 Reset all XP' },
    ]
  },
  moderation: {
    name: '🛡️ Moderation',
    emoji: '🛡️',
    commands: [
      { name: '/warn <user> <reason>', desc: 'Warn a user' },
      { name: '/warnings <user>', desc: 'View user warnings' },
      { name: '/remove-warn <user> <#>', desc: 'Remove specific warning' },
      { name: '/clear-warnings <user>', desc: 'Clear all warnings' },
      { name: '/mute <user> <duration> <reason>', desc: 'Timeout a user' },
      { name: '/unmute <user>', desc: 'Remove timeout' },
      { name: '/kick <user> <reason>', desc: 'Kick a user' },
      { name: '/ban <user> <reason>', desc: 'Ban a user' },
      { name: '/unban <user_id>', desc: 'Unban a user' },
      { name: '/purge <amount> [user]', desc: 'Delete messages' },
      { name: '/slowmode <duration>', desc: 'Set channel slowmode' },
      { name: '/lock', desc: 'Lock channel' },
      { name: '/unlock', desc: 'Unlock channel' },
      { name: '/set-mod-log <channel>', desc: 'Set mod log channel' },
    ]
  },
  config: {
    name: '⚙️ Configuration',
    emoji: '⚙️',
    commands: [
      { name: '/config', desc: 'View all settings' },
      { name: '/personality <mode>', desc: 'Change personality' },
      { name: '/language <lang>', desc: 'Set language' },
      { name: '/nsfw-filter <on/off>', desc: 'Toggle NSFW filter' },
      { name: '/profanity-filter <on/off>', desc: 'Toggle profanity filter' },
      { name: '/enable-bot / /disable-bot', desc: 'Toggle bot' },
      { name: '/lock-bot / /unlock-bot', desc: 'Owner mode' },
      { name: '/channel-restriction', desc: 'Manage channel restrictions' },
      { name: '/allow-channel / /block-channel', desc: 'Configure channels' },
      { name: '/role-restriction', desc: 'Manage role restrictions' },
      { name: '/allow-role / /block-role', desc: 'Configure roles (supports both whitelist AND blacklist)' },
      { name: '/set-password / /remove-password', desc: 'Password protection' },
      { name: '/add-admin-role / /remove-admin-role', desc: 'Custom admin roles' },
    ]
  },
  welcome: {
    name: '👋 Welcome System',
    emoji: '👋',
    commands: [
      { name: '/welcome-setup <channel>', desc: 'Set welcome channel' },
      { name: '/welcome-message <text>', desc: 'Set welcome message' },
      { name: '/welcome-toggle <on/off>', desc: 'Enable/disable welcomes' },
      { name: '/goodbye-setup <channel>', desc: 'Set goodbye channel' },
      { name: '/goodbye-message <text>', desc: 'Set goodbye message' },
      { name: '/goodbye-toggle <on/off>', desc: 'Enable/disable goodbyes' },
    ]
  },
  automod: {
    name: '🤖 Auto-Moderation',
    emoji: '🤖',
    commands: [
      { name: '/automod-setup', desc: 'Configure auto-mod rules' },
      { name: '/automod-ignore', desc: 'Ignore channels/roles' },
      { name: '/automod-log <channel>', desc: 'Set auto-mod log channel' },
      { name: '/automod-config', desc: 'View current config' },
    ]
  },
  reactions: {
    name: '🎭 Reaction Roles',
    emoji: '🎭',
    commands: [
      { name: '/reaction-role-create', desc: 'Create reaction role' },
      { name: '/reaction-role-remove', desc: 'Remove reaction role' },
      { name: '/reaction-role-list', desc: 'List all reaction roles' },
      { name: '/reaction-role-clear', desc: 'Clear message reactions' },
    ]
  },
  misc: {
    name: '🎮 Miscellaneous',
    emoji: '🎮',
    commands: [
      { name: '/commands', desc: 'Show this menu' },
      { name: '/myid', desc: 'Get your user ID' },
      { name: '/list-personalities', desc: 'View personality modes' },
    ]
  }
};

function createMainCommandsEmbed() {
  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('📚 Mai Bot Commands')
    .setDescription('Select a category below to view commands, or click "View All" to see everything at once!')
    .addFields(
      Object.entries(COMMAND_CATEGORIES).map(([key, category]) => ({
        name: `${category.emoji} ${category.name}`,
        value: `${category.commands.length} command${category.commands.length !== 1 ? 's' : ''}`,
        inline: true
      }))
    )
    .setFooter({ text: '🔒 = Admin only • Use buttons below to navigate' })
    .setTimestamp();
  
  return embed;
}

function createCategoryEmbed(categoryKey) {
  const category = COMMAND_CATEGORIES[categoryKey];
  
  if (!category) {
    return new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('❌ Category Not Found')
      .setDescription('This category doesn\'t exist!');
  }
  
  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle(`${category.emoji} ${category.name}`)
    .setDescription(
      category.commands.map(cmd => 
        `**${cmd.name}**\n${cmd.desc}`
      ).join('\n\n')
    )
    .setFooter({ text: '🔒 = Admin only • Use buttons to navigate categories' })
    .setTimestamp();
  
  return embed;
}

function createAllCommandsEmbed() {
  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('📚 All Commands')
    .setDescription('Complete list of all available commands:')
    .setFooter({ text: '🔒 = Admin only' })
    .setTimestamp();
  
  Object.entries(COMMAND_CATEGORIES).forEach(([key, category]) => {
    const commandList = category.commands
      .map(cmd => `**${cmd.name}** - ${cmd.desc}`)
      .join('\n');
    
    embed.addFields({
      name: `${category.emoji} ${category.name}`,
      value: commandList,
      inline: false
    });
  });
  
  return embed;
}

function createCategoryButtons() {
  const rows = [];
  const categories = Object.keys(COMMAND_CATEGORIES);
  
  // Create rows of 5 buttons each
  for (let i = 0; i < categories.length; i += 5) {
    const row = new ActionRowBuilder();
    const slice = categories.slice(i, i + 5);
    
    slice.forEach(key => {
      const category = COMMAND_CATEGORIES[key];
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(`cat_${key}`)
          .setLabel(category.name.replace(/^[^\s]+ /, '')) // Remove emoji from label
          .setEmoji(category.emoji)
          .setStyle(ButtonStyle.Primary)
      );
    });
    
    rows.push(row);
  }
  
  // Add navigation row
  const navRow = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('commands_home')
        .setLabel('Home')
        .setEmoji('🏠')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('commands_all')
        .setLabel('View All')
        .setEmoji('📋')
        .setStyle(ButtonStyle.Success)
    );
  
  rows.push(navRow);
  
  return rows;
}

function createQuickHelpButtons() {
  return new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('quick_chat')
        .setLabel('Quick Start')
        .setEmoji('🚀')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('quick_personality')
        .setLabel('Personalities')
        .setEmoji('🎭')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('quick_moderation')
        .setLabel('Moderation')
        .setEmoji('🛡️')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('quick_config')
        .setLabel('Setup')
        .setEmoji('⚙️')
        .setStyle(ButtonStyle.Secondary)
    );
}

function createQuickChatHelp() {
  return new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle('🚀 Quick Start Guide')
    .setDescription('Get started with Mai in seconds!')
    .addFields(
      { name: '1️⃣ Chat with Mai', value: 'Just mention `@Mai` followed by your message!\nExample: `@Mai hello!`' },
      { name: '2️⃣ Use Slash Commands', value: 'Type `/` to see all available commands\nExample: `/chat Hello Mai!`' },
      { name: '3️⃣ Change Personality', value: 'Make Mai talk differently:\n`/personality <mode>`\nTry: anime, pirate, gen_z, and more!' },
      { name: '💡 Pro Tip', value: 'Mai remembers things you tell her! Say "remember that..." to add to her memory.' }
    );
}

function createQuickPersonalityHelp() {
  return new EmbedBuilder()
    .setColor('#FF69B4')
    .setTitle('🎭 Personality Modes')
    .setDescription('Make Mai talk in different styles!')
    .addFields(
      { name: '🌟 Normal', value: 'Friendly and casual', inline: true },
      { name: '🏴‍☠️ Pirate', value: 'Arr, matey!', inline: true },
      { name: '😸 Anime', value: 'Kawaii desu~', inline: true },
      { name: '🎩 Formal', value: 'Professional speech', inline: true },
      { name: '🔥 Gen Z', value: 'No cap fr fr', inline: true },
      { name: '🎪 More!', value: 'Use `/list-personalities`', inline: true }
    )
    .setFooter({ text: 'Change with: /personality <mode>' });
}

function createQuickModerationHelp() {
  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('🛡️ Moderation Quick Guide')
    .setDescription('Keep your server safe and organized!')
    .addFields(
      { name: '⚠️ Warnings', value: '`/warn <user> <reason>` - Warn users\n`/warnings <user>` - View warnings' },
      { name: '🔇 Timeouts', value: '`/mute <user> <time> <reason>` - Timeout\nExample: `/mute @user 1h spamming`' },
      { name: '🗑️ Cleanup', value: '`/purge <amount>` - Delete messages\n`/purge <amount> <user>` - Delete from specific user' },
      { name: '🔒 Channel Control', value: '`/lock` - Lock channel\n`/slowmode <seconds>` - Set slowmode' },
      { name: '🤖 Auto-Mod', value: '`/automod-setup` - Configure automatic moderation' }
    );
}

function createQuickConfigHelp() {
  return new EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('⚙️ Setup Guide')
    .setDescription('Configure Mai for your server!')
    .addFields(
      { name: '🎭 Personality', value: '`/personality <mode>` - Change how Mai talks' },
      { name: '🔒 Restrictions', value: '`/channel-restriction` - Limit to specific channels\n`/role-restriction` - Require/block roles' },
      { name: '🛡️ Filters', value: '`/nsfw-filter on` - Block NSFW content\n`/profanity-filter on` - Block bad words' },
      { name: '👋 Welcome', value: '`/welcome-setup` - Set up welcome messages' },
      { name: '📊 Leveling', value: '`/level-config` - Customize XP system\n`/xp-boost` - Bonus XP for actions' },
      { name: '📋 View Settings', value: '`/config` - See all current settings' }
    );
}

export {
  createMainCommandsEmbed,
  createCategoryEmbed,
  createAllCommandsEmbed,
  createCategoryButtons,
  createQuickHelpButtons,
  createQuickChatHelp,
  createQuickPersonalityHelp,
  createQuickModerationHelp,
  createQuickConfigHelp,
  COMMAND_CATEGORIES
};