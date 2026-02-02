// ═══════════════════════════════════════════════
// 📊 LEVELING & XP SYSTEM (Enhanced with Arcane-style features)
// ═══════════════════════════════════════════════
import fs from 'fs';

const LEVELS_FILE = './levels.json';
const LEVEL_CONFIG_FILE = './level-config.json';
const USER_PREFERENCES_FILE = './level-user-preferences.json';

// Default configuration
const DEFAULT_LEVEL_CONFIG = {
  enabled: true,
  xpPerMessage: 15,
  xpCooldown: 60000, // 1 minute between XP gains
  levelUpMessage: true,
  levelUpChannel: null, // null = same channel, or channel ID for dedicated channel
  announceLevelUp: true,
  mentionOnLevelUp: true, // Global setting for mentions
  xpMultiplier: 1.0,
  noXpRoles: [], // Roles that don't gain XP
  noXpChannels: [], // Channels where XP isn't gained
  roleRewards: {}, // { level: { roleId, stack, removePrevious } }
  
  // Advanced XP customization
  xpBoosts: {
    longMessage: 10, // Bonus XP for messages 50+ words
    sticker: 5, // Bonus XP for using stickers
    reply: 3, // Bonus XP for replying to messages
    attachment: 5, // Bonus XP for attachments (images, files)
    voice: 2, // Bonus XP per minute in voice
  },
  
  // Level-up difficulty customization
  levelFormula: {
    type: 'default', // 'default', 'linear', 'exponential', 'custom'
    baseXP: 100, // Starting XP requirement
    multiplier: 50, // Multiplier for level calculations
    exponent: 2, // Exponent for exponential growth
  }
};

// Load level data
function loadLevels() {
  try {
    if (!fs.existsSync(LEVELS_FILE)) {
      fs.writeFileSync(LEVELS_FILE, JSON.stringify({}, null, 2));
      return {};
    }
    return JSON.parse(fs.readFileSync(LEVELS_FILE, 'utf8'));
  } catch (error) {
    console.error('❌ Error loading levels:', error);
    return {};
  }
}

// Save level data
function saveLevels(data) {
  try {
    fs.writeFileSync(LEVELS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error saving levels:', error);
  }
}

// Load level config
function loadLevelConfig() {
  try {
    if (!fs.existsSync(LEVEL_CONFIG_FILE)) {
      fs.writeFileSync(LEVEL_CONFIG_FILE, JSON.stringify({}, null, 2));
      return {};
    }
    return JSON.parse(fs.readFileSync(LEVEL_CONFIG_FILE, 'utf8'));
  } catch (error) {
    console.error('❌ Error loading level config:', error);
    return {};
  }
}

// Save level config
function saveLevelConfig(data) {
  try {
    fs.writeFileSync(LEVEL_CONFIG_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error saving level config:', error);
  }
}

// Load user preferences
function loadUserPreferences() {
  try {
    if (!fs.existsSync(USER_PREFERENCES_FILE)) {
      fs.writeFileSync(USER_PREFERENCES_FILE, JSON.stringify({}, null, 2));
      return {};
    }
    return JSON.parse(fs.readFileSync(USER_PREFERENCES_FILE, 'utf8'));
  } catch (error) {
    console.error('❌ Error loading user preferences:', error);
    return {};
  }
}

// Save user preferences
function saveUserPreferences(data) {
  try {
    fs.writeFileSync(USER_PREFERENCES_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error saving user preferences:', error);
  }
}

// Get guild config
function getGuildLevelConfig(guildId) {
  const allConfigs = loadLevelConfig();
  if (!allConfigs[guildId]) {
    allConfigs[guildId] = { ...DEFAULT_LEVEL_CONFIG };
    saveLevelConfig(allConfigs);
  }
  // Ensure all new fields exist
  allConfigs[guildId] = { ...DEFAULT_LEVEL_CONFIG, ...allConfigs[guildId] };
  return allConfigs[guildId];
}

// Update guild config
function updateGuildLevelConfig(guildId, updates) {
  const allConfigs = loadLevelConfig();
  if (!allConfigs[guildId]) {
    allConfigs[guildId] = { ...DEFAULT_LEVEL_CONFIG };
  }
  allConfigs[guildId] = { ...allConfigs[guildId], ...updates };
  saveLevelConfig(allConfigs);
  return allConfigs[guildId];
}

// Get user mention preference
function getUserLevelMentionPreference(guildId, userId) {
  const prefs = loadUserPreferences();
  if (!prefs[guildId]) prefs[guildId] = {};
  // Default to true (mentions enabled)
  return prefs[guildId][userId]?.mentionOnLevelUp ?? true;
}

// Set user mention preference
function setUserLevelMentionPreference(guildId, userId, enabled) {
  const prefs = loadUserPreferences();
  if (!prefs[guildId]) prefs[guildId] = {};
  if (!prefs[guildId][userId]) prefs[guildId][userId] = {};
  prefs[guildId][userId].mentionOnLevelUp = enabled;
  saveUserPreferences(prefs);
  return enabled;
}

// Calculate XP needed for next level based on formula
function xpForLevel(level, config = null) {
  if (!config || !config.levelFormula) {
    // Default formula: 5 * (level^2) + 50 * level + 100
    return 5 * (level ** 2) + 50 * level + 100;
  }
  
  const formula = config.levelFormula;
  
  switch (formula.type) {
    case 'linear':
      // Linear: baseXP + (level * multiplier)
      return formula.baseXP + (level * formula.multiplier);
    
    case 'exponential':
      // Exponential: baseXP + (multiplier * (level^exponent))
      return formula.baseXP + (formula.multiplier * Math.pow(level, formula.exponent));
    
    case 'custom':
      // Custom formula (same as default but with custom values)
      return formula.multiplier * (level ** formula.exponent) + (formula.baseXP * level) + formula.baseXP;
    
    case 'default':
    default:
      // Default MEE6-style formula
      return 5 * (level ** 2) + 50 * level + 100;
  }
}

// Calculate total XP needed to reach a level
function totalXpForLevel(level, config = null) {
  let total = 0;
  for (let i = 0; i < level; i++) {
    total += xpForLevel(i, config);
  }
  return total;
}

// Get level from total XP
function getLevelFromXp(xp, config = null) {
  let level = 0;
  while (xp >= xpForLevel(level, config)) {
    xp -= xpForLevel(level, config);
    level++;
  }
  return { level, remainingXp: xp };
}

// Get user data
function getUserLevel(guildId, userId) {
  const levels = loadLevels();
  if (!levels[guildId]) levels[guildId] = {};
  if (!levels[guildId][userId]) {
    levels[guildId][userId] = {
      xp: 0,
      level: 0,
      totalXp: 0,
      lastXpGain: 0,
      messageCount: 0
    };
    saveLevels(levels);
  }
  return levels[guildId][userId];
}

// Calculate XP with boosts
function calculateXpWithBoosts(baseXp, message, config) {
  let totalXp = baseXp;
  
  if (!config.xpBoosts) return totalXp;
  
  // Long message bonus (50+ words)
  if (config.xpBoosts.longMessage && message.content) {
    const wordCount = message.content.trim().split(/\s+/).length;
    if (wordCount >= 50) {
      totalXp += config.xpBoosts.longMessage;
    }
  }
  
  // Sticker bonus
  if (config.xpBoosts.sticker && message.stickers && message.stickers.size > 0) {
    totalXp += config.xpBoosts.sticker;
  }
  
  // Reply bonus
  if (config.xpBoosts.reply && message.reference) {
    totalXp += config.xpBoosts.reply;
  }
  
  // Attachment bonus
  if (config.xpBoosts.attachment && message.attachments && message.attachments.size > 0) {
    totalXp += config.xpBoosts.attachment;
  }
  
  return totalXp;
}

// Update user XP (now with message parameter for boosts)
function addXp(guildId, userId, amount, message = null) {
  const levels = loadLevels();
  if (!levels[guildId]) levels[guildId] = {};
  if (!levels[guildId][userId]) {
    levels[guildId][userId] = {
      xp: 0,
      level: 0,
      totalXp: 0,
      lastXpGain: 0,
      messageCount: 0
    };
  }

  const userData = levels[guildId][userId];
  
  // Apply boosts if message is provided
  if (message) {
    const config = getGuildLevelConfig(guildId);
    amount = calculateXpWithBoosts(amount, message, config);
  }
  
  userData.xp += amount;
  userData.totalXp += amount;
  userData.messageCount++;
  userData.lastXpGain = Date.now();

  // Check for level up
  const config = getGuildLevelConfig(guildId);
  let leveledUp = false;
  let newLevel = userData.level;
  
  while (userData.xp >= xpForLevel(userData.level, config)) {
    userData.xp -= xpForLevel(userData.level, config);
    userData.level++;
    newLevel = userData.level;
    leveledUp = true;
  }

  saveLevels(levels);

  return {
    leveledUp,
    newLevel,
    currentXp: userData.xp,
    xpNeeded: xpForLevel(userData.level, config),
    totalXp: userData.totalXp,
    xpGained: amount
  };
}

// Set user level
function setUserLevel(guildId, userId, level) {
  const levels = loadLevels();
  if (!levels[guildId]) levels[guildId] = {};
  
  const config = getGuildLevelConfig(guildId);
  const totalXp = totalXpForLevel(level, config);
  
  levels[guildId][userId] = {
    xp: 0,
    level: level,
    totalXp: totalXp,
    lastXpGain: Date.now(),
    messageCount: levels[guildId][userId]?.messageCount || 0
  };
  
  saveLevels(levels);
  return levels[guildId][userId];
}

// Get leaderboard
function getLeaderboard(guildId, limit = 10) {
  const levels = loadLevels();
  if (!levels[guildId]) return [];

  const users = Object.entries(levels[guildId])
    .map(([userId, data]) => ({
      userId,
      ...data
    }))
    .sort((a, b) => b.totalXp - a.totalXp)
    .slice(0, limit);

  return users;
}

// Get user rank
function getUserRank(guildId, userId) {
  const levels = loadLevels();
  if (!levels[guildId]) return null;

  const sorted = Object.entries(levels[guildId])
    .map(([uid, data]) => ({ userId: uid, totalXp: data.totalXp }))
    .sort((a, b) => b.totalXp - a.totalXp);

  const rank = sorted.findIndex(u => u.userId === userId) + 1;
  return rank || null;
}

// Reset user XP
function resetUserXp(guildId, userId) {
  const levels = loadLevels();
  if (!levels[guildId]?.[userId]) return false;
  
  levels[guildId][userId] = {
    xp: 0,
    level: 0,
    totalXp: 0,
    lastXpGain: 0,
    messageCount: 0
  };
  
  saveLevels(levels);
  return true;
}

// Reset all guild XP
function resetGuildXp(guildId) {
  const levels = loadLevels();
  if (!levels[guildId]) return 0;
  
  const count = Object.keys(levels[guildId]).length;
  levels[guildId] = {};
  saveLevels(levels);
  return count;
}

// Add role reward (Arcane-style with stacking options)
function addRoleReward(guildId, level, roleId, options = {}) {
  const config = getGuildLevelConfig(guildId);
  if (!config.roleRewards) config.roleRewards = {};
  
  config.roleRewards[level] = {
    roleId: roleId,
    stack: options.stack !== false, // Default to true (stack roles)
    removePrevious: options.removePrevious || false // Default to false
  };
  
  updateGuildLevelConfig(guildId, config);
  return true;
}

// Remove role reward
function removeRoleReward(guildId, level) {
  const config = getGuildLevelConfig(guildId);
  if (!config.roleRewards) return false;
  if (!config.roleRewards[level]) return false;
  delete config.roleRewards[level];
  updateGuildLevelConfig(guildId, config);
  return true;
}

// Get role rewards
function getRoleRewards(guildId) {
  const config = getGuildLevelConfig(guildId);
  return config.roleRewards || {};
}

// Get all level roles for a user (for proper role management)
function getUserLevelRoles(guildId, userLevel) {
  const rewards = getRoleRewards(guildId);
  const rolesToAdd = [];
  const rolesToRemove = [];
  
  // Sort levels
  const sortedLevels = Object.keys(rewards).map(Number).sort((a, b) => a - b);
  
  for (const level of sortedLevels) {
    const reward = rewards[level];
    
    if (level <= userLevel) {
      // User has reached this level
      if (reward.removePrevious) {
        // Remove all previous level roles
        for (const prevLevel of sortedLevels) {
          if (prevLevel < level && rewards[prevLevel]) {
            rolesToRemove.push(rewards[prevLevel].roleId);
          }
        }
      }
      
      if (reward.stack || level === userLevel) {
        // Add this role
        rolesToAdd.push(reward.roleId);
      } else if (!reward.stack && level < userLevel) {
        // Don't stack, remove lower level roles
        rolesToRemove.push(reward.roleId);
      }
    } else {
      // User hasn't reached this level, ensure they don't have the role
      rolesToRemove.push(reward.roleId);
    }
  }
  
  // Remove duplicates and roles that are both added and removed
  const finalRolesToAdd = rolesToAdd.filter(r => !rolesToRemove.includes(r));
  const finalRolesToRemove = rolesToRemove.filter(r => !rolesToAdd.includes(r));
  
  return {
    add: [...new Set(finalRolesToAdd)],
    remove: [...new Set(finalRolesToRemove)]
  };
}

export {
  loadLevels,
  saveLevels,
  getGuildLevelConfig,
  updateGuildLevelConfig,
  xpForLevel,
  totalXpForLevel,
  getLevelFromXp,
  getUserLevel,
  addXp,
  setUserLevel,
  getLeaderboard,
  getUserRank,
  resetUserXp,
  resetGuildXp,
  addRoleReward,
  removeRoleReward,
  getRoleRewards,
  getUserLevelRoles,
  calculateXpWithBoosts,
  getUserLevelMentionPreference,
  setUserLevelMentionPreference,
  DEFAULT_LEVEL_CONFIG
};