import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

// ═══════════════════════════════════════════════
// 🎨 COLOR PALETTE
// ═══════════════════════════════════════════════
export const COLORS = {
  PRIMARY: 0xFF69B4,      // Hot Pink
  SUCCESS: 0x00FF7F,      // Spring Green
  ERROR: 0xFF4444,        // Red
  WARNING: 0xFFAA00,      // Orange
  INFO: 0x00D4FF,         // Cyan
  PERSONALITY: 0xA78BFA,  // Purple
  MODERATION: 0xFF6B6B,   // Coral Red
  CONFIG: 0x4ECDC4,       // Turquoise
  MEMORY: 0xFFA07A,       // Light Salmon
  STATS: 0x98D8C8,        // Mint
};

// ═══════════════════════════════════════════════
// 🎭 EMOJI SETS
// ═══════════════════════════════════════════════
export const EMOJIS = {
  SUCCESS: '✅',
  ERROR: '❌',
  WARNING: '⚠️',
  INFO: 'ℹ️',
  LOADING: '⏳',
  LOCK: '🔒',
  UNLOCK: '🔓',
  SETTINGS: '⚙️',
  MEMORY: '🧠',
  PERSONALITY: '🎭',
  LANGUAGE: '🌐',
  SHIELD: '🛡️',
  ROBOT: '🤖',
  SPARKLE: '✨',
  FIRE: '🔥',
  HEART: '💖',
  STAR: '⭐',
  CROWN: '👑',
  CHAT: '💬',
  MODERATOR: '👮',
  ADMIN: '👑',
  BAN: '🔨',
  KICK: '👢',
  MUTE: '🔇',
  WARN: '⚠️',
  USER: '👤',
  CHANNEL: '📢',
  ROLE: '🎯',
  TIME: '⏰',
  STATS: '📊',
};

// ═══════════════════════════════════════════════
// 🎨 EMBED CREATORS
// ═══════════════════════════════════════════════

/**
 * Create a beautiful AI response embed
 */
export function createAIResponseEmbed(response, personality = 'normal', userName = 'User') {
  const embed = new EmbedBuilder()
    .setColor(COLORS.PRIMARY)
    .setDescription(response)
    .setFooter({ 
      text: `Personality: ${personality.charAt(0).toUpperCase() + personality.slice(1)} • Powered by Mai AI`,
      iconURL: 'https://cdn.discordapp.com/emojis/1234567890.png' // Optional: Add bot avatar
    })
    .setTimestamp();

  // Add personality indicator
  const personalityEmojis = {
    normal: '💬',
    shakespearean: '🎭',
    anime: '🌸',
    pirate: '🏴‍☠️',
    formal: '🎩',
    gen_z: '🔥',
    hinglish: '🇮🇳',
    uwu: '🥺',
    southern: '🤠',
    aussie: '🦘',
    roast: '🔥'
  };

  embed.setAuthor({ 
    name: `Mai AI ${personalityEmojis[personality] || '💬'}`,
    iconURL: 'https://cdn.discordapp.com/emojis/1234567890.png' // Optional
  });

  return embed;
}

/**
 * Create a success embed
 */
export function createSuccessEmbed(title, description, fields = []) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.SUCCESS)
    .setTitle(`${EMOJIS.SUCCESS} ${title}`)
    .setDescription(description)
    .setTimestamp();

  if (fields.length > 0) {
    embed.addFields(fields);
  }

  return embed;
}

/**
 * Create an error embed
 */
export function createErrorEmbed(title, description, solution = null) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.ERROR)
    .setTitle(`${EMOJIS.ERROR} ${title}`)
    .setDescription(description)
    .setTimestamp();

  if (solution) {
    embed.addFields({
      name: `${EMOJIS.INFO} Solution`,
      value: solution,
      inline: false
    });
  }

  return embed;
}

/**
 * Create a warning embed
 */
export function createWarningEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(COLORS.WARNING)
    .setTitle(`${EMOJIS.WARNING} ${title}`)
    .setDescription(description)
    .setTimestamp();
}

/**
 * Create an info embed
 */
export function createInfoEmbed(title, description, fields = []) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.INFO)
    .setTitle(`${EMOJIS.INFO} ${title}`)
    .setDescription(description)
    .setTimestamp();

  if (fields.length > 0) {
    embed.addFields(fields);
  }

  return embed;
}

/**
 * Create a configuration display embed
 */
export function createConfigEmbed(serverName, config) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.CONFIG)
    .setTitle(`${EMOJIS.SETTINGS} Server Configuration`)
    .setDescription(`Current settings for **${serverName}**`)
    .addFields(
      {
        name: `${EMOJIS.ROBOT} Bot Status`,
        value: config.enabled ? `${EMOJIS.SUCCESS} Enabled` : `${EMOJIS.ERROR} Disabled`,
        inline: true
      },
      {
        name: `${EMOJIS.LANGUAGE} Language`,
        value: config.language.charAt(0).toUpperCase() + config.language.slice(1),
        inline: true
      },
      {
        name: `${EMOJIS.PERSONALITY} Personality`,
        value: config.personality.charAt(0).toUpperCase() + config.personality.slice(1),
        inline: true
      },
      {
        name: `${EMOJIS.SHIELD} Filters`,
        value: [
          `NSFW: ${config.nsfwFilter ? EMOJIS.SUCCESS : EMOJIS.ERROR}`,
          `Profanity: ${config.profanityFilter ? EMOJIS.SUCCESS : EMOJIS.ERROR}`
        ].join('\n'),
        inline: true
      },
      {
        name: `${EMOJIS.LOCK} Security`,
        value: [
          `Password: ${config.passwordProtected ? EMOJIS.LOCK : EMOJIS.UNLOCK}`,
          `Owner Only: ${config.ownerOnlyMode ? EMOJIS.SUCCESS : EMOJIS.ERROR}`
        ].join('\n'),
        inline: true
      },
      {
        name: `${EMOJIS.ROLE} Restrictions`,
        value: [
          `Role Restriction: ${config.roleRestriction?.enabled ? EMOJIS.SUCCESS : EMOJIS.ERROR}`,
          `Channel Restriction: ${config.channelRestriction?.enabled ? EMOJIS.SUCCESS : EMOJIS.ERROR}`
        ].join('\n'),
        inline: true
      }
    )
    .setFooter({ text: 'Use /config to view detailed settings' })
    .setTimestamp();

  return embed;
}

/**
 * Create a memory display embed
 */
export function createMemoryEmbed(serverName, memories) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.MEMORY)
    .setTitle(`${EMOJIS.MEMORY} Server Memory`)
    .setDescription(`What I remember about **${serverName}**`)
    .setTimestamp();

  if (Object.keys(memories).length === 0) {
    embed.addFields({
      name: 'Empty Memory',
      value: `${EMOJIS.INFO} I don't have any memories saved yet. Chat with me to build memories!`,
      inline: false
    });
  } else {
    const memoryEntries = Object.entries(memories).slice(0, 25); // Discord limit
    for (const [key, value] of memoryEntries) {
      embed.addFields({
        name: `${EMOJIS.STAR} ${key}`,
        value: `\`${value}\``,
        inline: false
      });
    }

    if (Object.keys(memories).length > 25) {
      embed.setFooter({ 
        text: `Showing 25 of ${Object.keys(memories).length} memories` 
      });
    }
  }

  return embed;
}

/**
 * Create a moderation action embed
 */
export function createModActionEmbed(action, user, moderator, reason, duration = null) {
  const actionEmojis = {
    warn: EMOJIS.WARN,
    mute: EMOJIS.MUTE,
    kick: EMOJIS.KICK,
    ban: EMOJIS.BAN,
    unmute: EMOJIS.SUCCESS,
    unban: EMOJIS.SUCCESS
  };

  const actionColors = {
    warn: COLORS.WARNING,
    mute: COLORS.WARNING,
    kick: COLORS.ERROR,
    ban: COLORS.ERROR,
    unmute: COLORS.SUCCESS,
    unban: COLORS.SUCCESS
  };

  const embed = new EmbedBuilder()
    .setColor(actionColors[action] || COLORS.MODERATION)
    .setTitle(`${actionEmojis[action] || EMOJIS.MODERATOR} ${action.toUpperCase()}`)
    .addFields(
      {
        name: `${EMOJIS.USER} User`,
        value: `${user.tag}\n\`${user.id}\``,
        inline: true
      },
      {
        name: `${EMOJIS.MODERATOR} Moderator`,
        value: `${moderator.tag}`,
        inline: true
      }
    )
    .setThumbnail(user.displayAvatarURL())
    .setTimestamp();

  if (reason) {
    embed.addFields({
      name: `${EMOJIS.INFO} Reason`,
      value: reason,
      inline: false
    });
  }

  if (duration) {
    embed.addFields({
      name: `${EMOJIS.TIME} Duration`,
      value: duration,
      inline: true
    });
  }

  return embed;
}

/**
 * Create a stats/info display embed
 */
export function createStatsEmbed(title, stats) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.STATS)
    .setTitle(`${EMOJIS.STATS} ${title}`)
    .setTimestamp();

  for (const [key, value] of Object.entries(stats)) {
    embed.addFields({
      name: key,
      value: String(value),
      inline: true
    });
  }

  return embed;
}

// ═══════════════════════════════════════════════
// 🎮 BUTTON CREATORS
// ═══════════════════════════════════════════════

/**
 * Create personality selection buttons
 */
export function createPersonalityButtons() {
  const row1 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('personality_normal')
        .setLabel('Normal')
        .setEmoji('💬')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('personality_anime')
        .setLabel('Anime')
        .setEmoji('🌸')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('personality_pirate')
        .setLabel('Pirate')
        .setEmoji('🏴‍☠️')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('personality_formal')
        .setLabel('Formal')
        .setEmoji('🎩')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('personality_gen_z')
        .setLabel('Gen Z')
        .setEmoji('🔥')
        .setStyle(ButtonStyle.Primary)
    );

  const row2 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('personality_shakespearean')
        .setLabel('Shakespeare')
        .setEmoji('🎭')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('personality_hinglish')
        .setLabel('Hinglish')
        .setEmoji('🇮🇳')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('personality_uwu')
        .setLabel('UwU')
        .setEmoji('🥺')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('personality_southern')
        .setLabel('Southern')
        .setEmoji('🤠')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('personality_aussie')
        .setLabel('Aussie')
        .setEmoji('🦘')
        .setStyle(ButtonStyle.Secondary)
    );

  const row3 = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('personality_roast')
        .setLabel('Roast Mode')
        .setEmoji('🔥')
        .setStyle(ButtonStyle.Danger)
    );

  return [row1, row2, row3];
}

/**
 * Create confirmation buttons
 */
export function createConfirmationButtons(confirmId = 'confirm', cancelId = 'cancel') {
  return new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId(confirmId)
        .setLabel('Confirm')
        .setEmoji(EMOJIS.SUCCESS)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(cancelId)
        .setLabel('Cancel')
        .setEmoji(EMOJIS.ERROR)
        .setStyle(ButtonStyle.Danger)
    );
}

/**
 * Create navigation buttons
 */
export function createNavigationButtons(hasNext = true, hasPrev = false) {
  const row = new ActionRowBuilder();

  if (hasPrev) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId('nav_prev')
        .setLabel('Previous')
        .setEmoji('◀️')
        .setStyle(ButtonStyle.Primary)
    );
  }

  if (hasNext) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId('nav_next')
        .setLabel('Next')
        .setEmoji('▶️')
        .setStyle(ButtonStyle.Primary)
    );
  }

  return row;
}

/**
 * Create help category buttons
 */
export function createHelpButtons() {
  return new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('help_basic')
        .setLabel('Basic')
        .setEmoji('💬')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('help_config')
        .setEmoji('⚙️')
        .setLabel('Config')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('help_mod')
        .setLabel('Moderation')
        .setEmoji('👮')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('help_all')
        .setLabel('All Commands')
        .setEmoji('📋')
        .setStyle(ButtonStyle.Secondary)
    );
}

// ═══════════════════════════════════════════════
// 📊 PROGRESS BARS
// ═══════════════════════════════════════════════

/**
 * Create a visual progress bar
 */
export function createProgressBar(current, max, length = 10) {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  const filled = Math.round((percentage / 100) * length);
  const empty = length - filled;
  
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `${bar} ${percentage.toFixed(0)}%`;
}

/**
 * Create a rate limit display
 */
export function createRateLimitDisplay(remaining, total) {
  const percentage = (remaining / total) * 100;
  const bars = Math.ceil(percentage / 10);
  const display = '🟦'.repeat(bars) + '⬜'.repeat(10 - bars);
  return `${display}\n${remaining}/${total} requests remaining`;
}

// ═══════════════════════════════════════════════
// 🎨 FORMATTING HELPERS
// ═══════════════════════════════════════════════

/**
 * Format a duration string
 */
export function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Format a timestamp
 */
export function formatTimestamp(timestamp, style = 'F') {
  return `<t:${Math.floor(timestamp / 1000)}:${style}>`;
}

/**
 * Create a divider
 */
export function createDivider(char = '─', length = 30) {
  return char.repeat(length);
}

/**
 * Create a fancy header
 */
export function createHeader(text) {
  const divider = createDivider('═', 40);
  return `${divider}\n${text.toUpperCase()}\n${divider}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export default {
  COLORS,
  EMOJIS,
  createAIResponseEmbed,
  createSuccessEmbed,
  createErrorEmbed,
  createWarningEmbed,
  createInfoEmbed,
  createConfigEmbed,
  createMemoryEmbed,
  createModActionEmbed,
  createStatsEmbed,
  createPersonalityButtons,
  createConfirmationButtons,
  createNavigationButtons,
  createHelpButtons,
  createProgressBar,
  createRateLimitDisplay,
  formatDuration,
  formatTimestamp,
  createDivider,
  createHeader,
  truncate
};
