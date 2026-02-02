// ═══════════════════════════════════════════════
// 🛡️ AUTO-MODERATION SYSTEM (Dyno Replacement)
// ═══════════════════════════════════════════════
import fs from 'fs';

const AUTOMOD_CONFIG_FILE = './automod-config.json';
const AUTOMOD_VIOLATIONS_FILE = './automod-violations.json';

// Default configuration
const DEFAULT_AUTOMOD_CONFIG = {
  enabled: true,
  
  // Spam Detection
  spamEnabled: true,
  spamMessageLimit: 5, // messages
  spamTimeWindow: 5000, // ms (5 seconds)
  spamAction: 'mute', // 'warn', 'mute', 'kick', 'ban'
  spamMuteDuration: 600000, // 10 minutes
  
  // Mass Mention Detection
  massMentionEnabled: true,
  massMentionLimit: 5, // mentions per message
  massMentionAction: 'mute',
  massMentionMuteDuration: 1800000, // 30 minutes
  
  // Caps Lock Detection
  capsEnabled: true,
  capsPercentage: 70, // % of message in caps
  capsMinLength: 10, // minimum message length to check
  capsAction: 'delete', // 'delete', 'warn', 'mute'
  
  // Link Spam Detection
  linkSpamEnabled: true,
  linkSpamLimit: 3, // links per message
  linkSpamAction: 'delete',
  
  // Invite Link Detection
  invitesEnabled: false,
  invitesAction: 'delete',
  invitesWhitelist: [], // Allowed server IDs
  
  // Duplicate Messages
  duplicateEnabled: true,
  duplicateLimit: 3, // same message X times
  duplicateTimeWindow: 10000, // within 10 seconds
  duplicateAction: 'warn',
  
  // Anti-Raid
  antiRaidEnabled: true,
  antiRaidJoinLimit: 10, // users
  antiRaidTimeWindow: 10000, // 10 seconds
  antiRaidAction: 'kick', // 'kick', 'ban'
  antiRaidLockdown: true, // Lock server when raid detected
  
  // Ignored roles/channels
  ignoredRoles: [], // Roles exempt from automod
  ignoredChannels: [], // Channels exempt from automod
  
  // Logging
  logChannel: null, // Channel to log automod actions
};

// Violation tracking
const userViolations = new Map(); // userId -> { type -> count }
const messageCache = new Map(); // userId -> [messages]
const joinCache = new Map(); // guildId -> [join timestamps]

// Load automod config
function loadAutomodConfig() {
  try {
    if (!fs.existsSync(AUTOMOD_CONFIG_FILE)) {
      fs.writeFileSync(AUTOMOD_CONFIG_FILE, JSON.stringify({}, null, 2));
      return {};
    }
    return JSON.parse(fs.readFileSync(AUTOMOD_CONFIG_FILE, 'utf8'));
  } catch (error) {
    console.error('❌ Error loading automod config:', error);
    return {};
  }
}

// Save automod config
function saveAutomodConfig(data) {
  try {
    fs.writeFileSync(AUTOMOD_CONFIG_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error saving automod config:', error);
  }
}

// Get guild automod config
function getGuildAutomodConfig(guildId) {
  const allConfigs = loadAutomodConfig();
  if (!allConfigs[guildId]) {
    allConfigs[guildId] = { ...DEFAULT_AUTOMOD_CONFIG };
    saveAutomodConfig(allConfigs);
  }
  return allConfigs[guildId];
}

// Update guild automod config
function updateGuildAutomodConfig(guildId, updates) {
  const allConfigs = loadAutomodConfig();
  if (!allConfigs[guildId]) {
    allConfigs[guildId] = { ...DEFAULT_AUTOMOD_CONFIG };
  }
  allConfigs[guildId] = { ...allConfigs[guildId], ...updates };
  saveAutomodConfig(allConfigs);
  return allConfigs[guildId];
}

// Check if user/channel is ignored
function isIgnored(config, member, channelId) {
  // Check ignored channels
  if (config.ignoredChannels.includes(channelId)) return true;
  
  // Check ignored roles
  if (member && member.roles && config.ignoredRoles) {
    for (const roleId of config.ignoredRoles) {
      if (member.roles.cache.has(roleId)) return true;
    }
  }
  
  return false;
}

// Spam detection
function checkSpam(userId, guildId, config) {
  if (!config.spamEnabled) return null;
  
  const now = Date.now();
  const key = `${guildId}-${userId}`;
  
  if (!messageCache.has(key)) {
    messageCache.set(key, []);
  }
  
  const messages = messageCache.get(key);
  
  // Add current message
  messages.push(now);
  
  // Remove old messages outside time window
  const filtered = messages.filter(time => now - time < config.spamTimeWindow);
  messageCache.set(key, filtered);
  
  // Check if spam limit exceeded
  if (filtered.length >= config.spamMessageLimit) {
    // Clear cache for this user
    messageCache.delete(key);
    return {
      violation: 'spam',
      action: config.spamAction,
      duration: config.spamMuteDuration,
      reason: `Spam detected: ${filtered.length} messages in ${config.spamTimeWindow / 1000}s`
    };
  }
  
  return null;
}

// Mass mention detection
function checkMassMention(message, config) {
  if (!config.massMentionEnabled) return null;
  
  const mentions = message.mentions.users.size + message.mentions.roles.size;
  
  if (mentions >= config.massMentionLimit) {
    return {
      violation: 'mass-mention',
      action: config.massMentionAction,
      duration: config.massMentionMuteDuration,
      reason: `Mass mention: ${mentions} mentions`
    };
  }
  
  return null;
}

// Caps lock detection
function checkCaps(content, config) {
  if (!config.capsEnabled) return null;
  if (content.length < config.capsMinLength) return null;
  
  const letters = content.replace(/[^a-zA-Z]/g, '');
  if (letters.length === 0) return null;
  
  const caps = content.replace(/[^A-Z]/g, '');
  const percentage = (caps.length / letters.length) * 100;
  
  if (percentage >= config.capsPercentage) {
    return {
      violation: 'caps',
      action: config.capsAction,
      reason: `Excessive caps: ${percentage.toFixed(0)}%`
    };
  }
  
  return null;
}

// Link spam detection
function checkLinkSpam(content, config) {
  if (!config.linkSpamEnabled) return null;
  
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const links = content.match(urlRegex) || [];
  
  if (links.length >= config.linkSpamLimit) {
    return {
      violation: 'link-spam',
      action: config.linkSpamAction,
      reason: `Link spam: ${links.length} links`
    };
  }
  
  return null;
}

// Invite link detection
function checkInvites(content, config) {
  if (!config.invitesEnabled) return null;
  
  const inviteRegex = /(discord\.gg\/|discord\.com\/invite\/|discordapp\.com\/invite\/)([a-zA-Z0-9]+)/gi;
  const invites = content.match(inviteRegex);
  
  if (invites && invites.length > 0) {
    return {
      violation: 'invite-link',
      action: config.invitesAction,
      reason: 'Discord invite link detected'
    };
  }
  
  return null;
}

// Duplicate message detection
function checkDuplicate(userId, content, guildId, config) {
  if (!config.duplicateEnabled) return null;
  
  const now = Date.now();
  const key = `dup-${guildId}-${userId}`;
  
  if (!messageCache.has(key)) {
    messageCache.set(key, []);
  }
  
  const messages = messageCache.get(key);
  
  // Add current message
  messages.push({ content, time: now });
  
  // Remove old messages
  const filtered = messages.filter(msg => now - msg.time < config.duplicateTimeWindow);
  messageCache.set(key, filtered);
  
  // Count duplicates
  const duplicates = filtered.filter(msg => msg.content === content).length;
  
  if (duplicates >= config.duplicateLimit) {
    messageCache.delete(key);
    return {
      violation: 'duplicate',
      action: config.duplicateAction,
      reason: `Duplicate message: sent ${duplicates} times`
    };
  }
  
  return null;
}

// Anti-raid detection
function checkAntiRaid(guildId, config) {
  if (!config.antiRaidEnabled) return null;
  
  const now = Date.now();
  
  if (!joinCache.has(guildId)) {
    joinCache.set(guildId, []);
  }
  
  const joins = joinCache.get(guildId);
  
  // Add current join
  joins.push(now);
  
  // Remove old joins
  const filtered = joins.filter(time => now - time < config.antiRaidTimeWindow);
  joinCache.set(guildId, filtered);
  
  // Check if raid detected
  if (filtered.length >= config.antiRaidJoinLimit) {
    return {
      violation: 'raid',
      action: config.antiRaidAction,
      lockdown: config.antiRaidLockdown,
      reason: `Raid detected: ${filtered.length} joins in ${config.antiRaidTimeWindow / 1000}s`
    };
  }
  
  return null;
}

// Track user join for anti-raid
function trackJoin(guildId) {
  const now = Date.now();
  
  if (!joinCache.has(guildId)) {
    joinCache.set(guildId, []);
  }
  
  joinCache.get(guildId).push(now);
}

// Clean up old cache entries (call periodically)
function cleanupCache() {
  const now = Date.now();
  const maxAge = 60000; // 1 minute
  
  for (const [key, messages] of messageCache.entries()) {
    if (Array.isArray(messages)) {
      const filtered = messages.filter(time => now - time < maxAge);
      if (filtered.length === 0) {
        messageCache.delete(key);
      } else {
        messageCache.set(key, filtered);
      }
    }
  }
  
  for (const [key, joins] of joinCache.entries()) {
    const filtered = joins.filter(time => now - time < maxAge);
    if (filtered.length === 0) {
      joinCache.delete(key);
    } else {
      joinCache.set(key, filtered);
    }
  }
}

// Start periodic cleanup
setInterval(cleanupCache, 30000); // Clean every 30 seconds

export {
  loadAutomodConfig,
  saveAutomodConfig,
  getGuildAutomodConfig,
  updateGuildAutomodConfig,
  isIgnored,
  checkSpam,
  checkMassMention,
  checkCaps,
  checkLinkSpam,
  checkInvites,
  checkDuplicate,
  checkAntiRaid,
  trackJoin,
  DEFAULT_AUTOMOD_CONFIG
};
