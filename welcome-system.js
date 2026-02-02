// ═══════════════════════════════════════════════
// 👋 WELCOME & GOODBYE SYSTEM
// ═══════════════════════════════════════════════
import fs from 'fs';

const WELCOME_CONFIG_FILE = './welcome-config.json';

// Default configuration
const DEFAULT_WELCOME_CONFIG = {
  welcomeEnabled: false,
  welcomeChannel: null,
  welcomeMessage: 'Welcome {user} to **{server}**! You are member #{membercount}!',
  welcomeEmbed: true,
  welcomeEmbedColor: '#5865F2',
  welcomeEmbedTitle: '👋 Welcome!',
  welcomeEmbedDescription: 'Welcome {mention} to **{server}**!\n\nYou are member **#{membercount}**!',
  welcomeEmbedThumbnail: true, // Use user avatar
  welcomeEmbedImage: null, // Optional banner image URL
  
  goodbyeEnabled: false,
  goodbyeChannel: null,
  goodbyeMessage: 'Goodbye **{user}**! We hope to see you again!',
  goodbyeEmbed: true,
  goodbyeEmbedColor: '#ED4245',
  goodbyeEmbedTitle: '👋 Goodbye',
  goodbyeEmbedDescription: '**{user}** has left the server. We\'ll miss you!',
  
  autoRole: null, // Role to give on join
  autoRoleDelay: 0, // Delay in seconds before giving role
  
  dmWelcome: false,
  dmWelcomeMessage: 'Welcome to **{server}**! Thanks for joining!',
};

// Load welcome config
function loadWelcomeConfig() {
  try {
    if (!fs.existsSync(WELCOME_CONFIG_FILE)) {
      fs.writeFileSync(WELCOME_CONFIG_FILE, JSON.stringify({}, null, 2));
      return {};
    }
    return JSON.parse(fs.readFileSync(WELCOME_CONFIG_FILE, 'utf8'));
  } catch (error) {
    console.error('❌ Error loading welcome config:', error);
    return {};
  }
}

// Save welcome config
function saveWelcomeConfig(data) {
  try {
    fs.writeFileSync(WELCOME_CONFIG_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error saving welcome config:', error);
  }
}

// Get guild welcome config
function getGuildWelcomeConfig(guildId) {
  const allConfigs = loadWelcomeConfig();
  if (!allConfigs[guildId]) {
    allConfigs[guildId] = { ...DEFAULT_WELCOME_CONFIG };
    saveWelcomeConfig(allConfigs);
  }
  return allConfigs[guildId];
}

// Update guild welcome config
function updateGuildWelcomeConfig(guildId, updates) {
  const allConfigs = loadWelcomeConfig();
  if (!allConfigs[guildId]) {
    allConfigs[guildId] = { ...DEFAULT_WELCOME_CONFIG };
  }
  allConfigs[guildId] = { ...allConfigs[guildId], ...updates };
  saveWelcomeConfig(allConfigs);
  return allConfigs[guildId];
}

// Replace placeholders in message
function replacePlaceholders(text, member, guild) {
  if (!text) return '';
  
  return text
    .replace(/{user}/g, member.user.username)
    .replace(/{mention}/g, `<@${member.user.id}>`)
    .replace(/{server}/g, guild.name)
    .replace(/{membercount}/g, guild.memberCount.toString())
    .replace(/{tag}/g, member.user.tag)
    .replace(/{id}/g, member.user.id);
}

export {
  loadWelcomeConfig,
  saveWelcomeConfig,
  getGuildWelcomeConfig,
  updateGuildWelcomeConfig,
  replacePlaceholders,
  DEFAULT_WELCOME_CONFIG
};
