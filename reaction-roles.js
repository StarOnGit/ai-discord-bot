// ═══════════════════════════════════════════════
// 🎭 REACTION ROLES SYSTEM
// ═══════════════════════════════════════════════
import fs from 'fs';

const REACTION_ROLES_FILE = './reaction-roles.json';

// Load reaction roles
function loadReactionRoles() {
  try {
    if (!fs.existsSync(REACTION_ROLES_FILE)) {
      fs.writeFileSync(REACTION_ROLES_FILE, JSON.stringify({}, null, 2));
      return {};
    }
    return JSON.parse(fs.readFileSync(REACTION_ROLES_FILE, 'utf8'));
  } catch (error) {
    console.error('❌ Error loading reaction roles:', error);
    return {};
  }
}

// Save reaction roles
function saveReactionRoles(data) {
  try {
    fs.writeFileSync(REACTION_ROLES_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error saving reaction roles:', error);
  }
}

// Add reaction role
function addReactionRole(guildId, messageId, emoji, roleId) {
  const data = loadReactionRoles();
  
  if (!data[guildId]) data[guildId] = {};
  if (!data[guildId][messageId]) data[guildId][messageId] = {};
  
  data[guildId][messageId][emoji] = roleId;
  saveReactionRoles(data);
  
  return true;
}

// Remove reaction role
function removeReactionRole(guildId, messageId, emoji) {
  const data = loadReactionRoles();
  
  if (!data[guildId]?.[messageId]?.[emoji]) return false;
  
  delete data[guildId][messageId][emoji];
  
  // Clean up empty objects
  if (Object.keys(data[guildId][messageId]).length === 0) {
    delete data[guildId][messageId];
  }
  if (Object.keys(data[guildId]).length === 0) {
    delete data[guildId];
  }
  
  saveReactionRoles(data);
  return true;
}

// Get reaction role
function getReactionRole(guildId, messageId, emoji) {
  const data = loadReactionRoles();
  return data[guildId]?.[messageId]?.[emoji] || null;
}

// Get all reaction roles for a message
function getMessageReactionRoles(guildId, messageId) {
  const data = loadReactionRoles();
  return data[guildId]?.[messageId] || {};
}

// Get all reaction roles for a guild
function getGuildReactionRoles(guildId) {
  const data = loadReactionRoles();
  return data[guildId] || {};
}

// Remove all reaction roles for a message
function removeMessageReactionRoles(guildId, messageId) {
  const data = loadReactionRoles();
  
  if (!data[guildId]?.[messageId]) return 0;
  
  const count = Object.keys(data[guildId][messageId]).length;
  delete data[guildId][messageId];
  
  if (Object.keys(data[guildId]).length === 0) {
    delete data[guildId];
  }
  
  saveReactionRoles(data);
  return count;
}

export {
  loadReactionRoles,
  saveReactionRoles,
  addReactionRole,
  removeReactionRole,
  getReactionRole,
  getMessageReactionRoles,
  getGuildReactionRoles,
  removeMessageReactionRoles
};
