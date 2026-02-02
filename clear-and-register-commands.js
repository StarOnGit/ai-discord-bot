// ═══════════════════════════════════════════════
// 🗑️ DELETE ALL COMMANDS THEN RE-REGISTER
// ═══════════════════════════════════════════════
// This will completely clear Discord's command cache
// and re-register everything fresh

import "dotenv/config";
import { REST, Routes } from "discord.js";

const CLIENT_ID = process.env.CLIENT_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN) {
  console.error('❌ ERROR: DISCORD_TOKEN not found in .env file!');
  process.exit(1);
}

if (!CLIENT_ID) {
  console.error('❌ ERROR: CLIENT_ID not found in .env file!');
  console.log('💡 To find your CLIENT_ID:');
  console.log('   1. Go to https://discord.com/developers/applications');
  console.log('   2. Click your bot');
  console.log('   3. Copy the "Application ID"');
  console.log('   4. Add to .env: CLIENT_ID=paste_id_here');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

async function clearAndRegister() {
  try {
    console.log('🗑️  STEP 1: Deleting ALL existing commands...');
    
    // Delete all global commands
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: [] },
    );
    
    console.log('✅ All commands deleted!');
    console.log('⏳ Waiting 3 seconds...\n');
    
    // Wait for Discord to process the deletion
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('📝 STEP 2: Registering ALL commands fresh...');
    
    const commands = [
      { name: 'commands', description: 'Show all available commands with interactive categories' },
      { name: 'chat', description: 'Chat with the AI bot', options: [{ name: 'message', type: 3, description: 'Your message to the bot', required: true }] },
      { name: 'personality', description: 'View or change bot personality mode (Admin/Mod to change)', options: [{ name: 'mode', type: 3, description: 'Select a personality mode', required: false, choices: [{ name: 'Normal', value: 'normal' }, { name: 'Shakespearean', value: 'shakespearean' }, { name: 'Anime', value: 'anime' }, { name: 'Pirate', value: 'pirate' }, { name: 'Formal', value: 'formal' }, { name: 'Gen Z', value: 'gen_z' }, { name: 'Hinglish', value: 'hinglish' }, { name: 'UwU', value: 'uwu' }, { name: 'Southern', value: 'southern' }, { name: 'Aussie', value: 'aussie' }, { name: 'Roast', value: 'roast' }] }] },
      { name: 'memory', description: 'View what the bot remembers about this server' },
      { name: 'forget', description: 'Make bot forget specific information (Admin/Mod only)', options: [{ name: 'thing', type: 3, description: 'What to forget', required: true }] },
      { name: 'nsfw-filter', description: 'Toggle NSFW filter (Admin/Mod only)', options: [{ name: 'enabled', type: 5, description: 'Enable or disable NSFW filter', required: true }] },
      { name: 'profanity-filter', description: 'Toggle profanity filter (Admin/Mod only)', options: [{ name: 'enabled', type: 5, description: 'Enable or disable profanity filter', required: true }] },
      { name: 'config', description: 'View bot configuration for this server' },
      { name: 'myid', description: 'Get your Discord user ID' },
      { name: 'clear-memory', description: 'Clear all server memory (Admin/Mod only)' },
      { name: 'role-restriction', description: 'Configure role restrictions (Admin/Mod only)', options: [{ name: 'action', type: 3, description: 'Action to perform', required: true, choices: [{ name: 'Enable', value: 'enable' }, { name: 'Disable', value: 'disable' }, { name: 'Set Whitelist Mode', value: 'whitelist' }, { name: 'Set Blacklist Mode', value: 'blacklist' }, { name: 'View Status', value: 'status' }] }] },
      { name: 'allow-role', description: 'Add role to whitelist (Admin/Mod only)', options: [{ name: 'role', type: 8, description: 'Role to allow', required: true }] },
      { name: 'block-role', description: 'Add role to blacklist (Admin/Mod only)', options: [{ name: 'role', type: 8, description: 'Role to block', required: true }] },
      { name: 'remove-role', description: 'Remove role from restrictions (Admin/Mod only)', options: [{ name: 'role', type: 8, description: 'Role to remove', required: true }] },
      { name: 'list-roles', description: 'List all role restrictions (Admin/Mod only)' },
      { name: 'clear-roles', description: 'Clear all role restrictions (Admin/Mod only)' },
      { name: 'channel-restriction', description: 'Configure channel restrictions (Admin/Mod only)', options: [{ name: 'action', type: 3, description: 'Action to perform', required: true, choices: [{ name: 'Enable', value: 'enable' }, { name: 'Disable', value: 'disable' }, { name: 'Allow This Channel', value: 'allow' }, { name: 'Block This Channel', value: 'block' }, { name: 'View Status', value: 'status' }] }, { name: 'channel', type: 7, description: 'Channel to allow/block (optional, uses current if not specified)', required: false }] },
      { name: 'allow-channel', description: 'Allow a specific channel (Admin/Mod only)', options: [{ name: 'channel', type: 7, description: 'Channel to allow', required: true }] },
      { name: 'block-channel', description: 'Block a specific channel (Admin/Mod only)', options: [{ name: 'channel', type: 7, description: 'Channel to block', required: true }] },
      { name: 'list-channels', description: 'List all channel restrictions (Admin/Mod only)' },
      { name: 'clear-channels', description: 'Clear all channel restrictions (Admin/Mod only)' },
      { name: 'set-password', description: 'Set password protection (Admin/Mod only)', options: [{ name: 'password', type: 3, description: 'Password to set', required: true }] },
      { name: 'remove-password', description: 'Remove password protection (Admin/Mod only)' },
      { name: 'show-password', description: 'Show current password (Admin/Mod only)' },
      { name: 'language', description: 'Set bot response language (Admin/Mod only)', options: [{ name: 'lang', type: 3, description: 'Language to use', required: true, choices: [{ name: 'English', value: 'english' }, { name: 'Spanish', value: 'spanish' }, { name: 'French', value: 'french' }, { name: 'Hindi', value: 'hindi' }, { name: 'Japanese', value: 'japanese' }, { name: 'German', value: 'german' }] }] },
      { name: 'add-admin-role', description: 'Add role as admin (Admin/Mod only)', options: [{ name: 'role', type: 8, description: 'Role to add as admin', required: true }] },
      { name: 'remove-admin-role', description: 'Remove admin role (Admin/Mod only)', options: [{ name: 'role', type: 8, description: 'Role to remove from admins', required: true }] },
      { name: 'set-keyword', description: 'Set required keyword (Admin/Mod only)', options: [{ name: 'keyword', type: 3, description: 'Keyword that messages must contain', required: true }] },
      { name: 'remove-keyword', description: 'Remove keyword requirement (Admin/Mod only)' },
      { name: 'enable-bot', description: 'Enable bot responses (Admin/Mod only)' },
      { name: 'disable-bot', description: 'Disable bot responses (Admin/Mod only)' },
      { name: 'lock-bot', description: 'Lock bot to admins only (Admin/Mod only)' },
      { name: 'unlock-bot', description: 'Unlock bot for everyone (Admin/Mod only)' },
      { name: 'clear-verified', description: 'Clear all verified users (Owner only)' },
      { name: 'list-personalities', description: 'List all available personality modes' },
      { name: 'slowmode', description: 'Set slowmode for the channel (Mod only)', options: [{ name: 'duration', type: 4, description: 'Slowmode duration in seconds (0-21600)', required: false, min_value: 0, max_value: 21600 }, { name: 'custom', type: 3, description: 'Custom duration (e.g., 5m, 1h, 30s) - overrides duration', required: false }] },
      { name: 'lock', description: 'Lock the channel (Mod only)' },
      { name: 'unlock', description: 'Unlock the channel (Mod only)' },
      { name: 'warn', description: 'Warn a user (Mod only)', options: [{ name: 'user', type: 6, description: 'User to warn', required: true }, { name: 'reason', type: 3, description: 'Reason for the warning', required: true }, { name: 'duration', type: 3, description: 'Warning expires after (e.g., 7d, 30d, 90d) - leave empty for permanent', required: false }, { name: 'dm', type: 5, description: 'Send DM to user?', required: false }] },
      { name: 'mute', description: 'Timeout a user (Mod only)', options: [{ name: 'user', type: 6, description: 'User to mute', required: true }, { name: 'duration', type: 3, description: 'Duration (e.g., 10m, 1h, 1d)', required: true }, { name: 'reason', type: 3, description: 'Reason for the mute', required: false }, { name: 'dm', type: 5, description: 'Send DM to user?', required: false }] },
      { name: 'unmute', description: 'Remove timeout from a user (Mod only)', options: [{ name: 'user', type: 6, description: 'User to unmute', required: true }, { name: 'dm', type: 5, description: 'Send DM to user?', required: false }] },
      { name: 'warnings', description: 'View warnings for a user (Mod only)', options: [{ name: 'user', type: 6, description: 'User to check warnings for', required: true }] },
      { name: 'remove-warn', description: 'Remove a specific warning from a user (Mod only)', options: [{ name: 'user', type: 6, description: 'User to remove warning from', required: true }, { name: 'warning_number', type: 4, description: 'Warning number to remove (see /warnings)', required: true }] },
      { name: 'clear-warnings', description: 'Clear all warnings for a user (Admin only)', options: [{ name: 'user', type: 6, description: 'User to clear warnings for', required: true }] },
      { name: 'kick', description: 'Kick a user from the server (Mod only)', options: [{ name: 'user', type: 6, description: 'User to kick', required: true }, { name: 'reason', type: 3, description: 'Reason for the kick', required: false }, { name: 'dm', type: 5, description: 'Send DM to user?', required: false }] },
      { name: 'ban', description: 'Ban a user from the server (Mod only)', options: [{ name: 'user', type: 6, description: 'User to ban', required: true }, { name: 'reason', type: 3, description: 'Reason for the ban', required: false }, { name: 'delete_days', type: 4, description: 'Delete messages from last X days (0-7)', required: false, min_value: 0, max_value: 7 }, { name: 'dm', type: 5, description: 'Send DM to user?', required: false }] },
      { name: 'unban', description: 'Unban a user from the server (Mod only)', options: [{ name: 'user', type: 6, description: 'User to unban', required: true }, { name: 'reason', type: 3, description: 'Reason for the unban', required: false }] },
      { name: 'set-log-channel', description: 'Set the moderation log channel (Admin only)', options: [{ name: 'channel', type: 7, description: 'Channel to log moderation actions', required: true }] },
      
      // LEVELING COMMANDS
      { name: 'rank', description: 'Check your or someone else\'s level and XP', options: [{ name: 'user', type: 6, description: 'User to check (leave empty for yourself)', required: false }] },
      { name: 'leaderboard', description: 'View the server\'s XP leaderboard', options: [{ name: 'page', type: 4, description: 'Page number (default: 1)', required: false }] },
      { name: 'set-level', description: 'Set a user\'s level (Admin only)', options: [{ name: 'user', type: 6, description: 'User to set level for', required: true }, { name: 'level', type: 4, description: 'Level to set', required: true }] },
      { name: 'reset-xp', description: 'Reset a user\'s XP and level (Admin only)', options: [{ name: 'user', type: 6, description: 'User to reset', required: true }] },
      { name: 'reset-all-xp', description: 'Reset ALL XP in the server (Admin only)' },
      { name: 'add-role-reward', description: 'Add a role reward for reaching a level (Admin only)', options: [{ name: 'level', type: 4, description: 'Level required', required: true }, { name: 'role', type: 8, description: 'Role to give', required: true }] },
      { name: 'remove-role-reward', description: 'Remove a role reward (Admin only)', options: [{ name: 'level', type: 4, description: 'Level to remove reward from', required: true }] },
      { name: 'list-role-rewards', description: 'List all role rewards' },
      { name: 'level-toggle', description: 'Enable or disable the leveling system (Admin only)', options: [{ name: 'enabled', type: 5, description: 'Enable or disable', required: true }] },
      { name: 'level-channel', description: 'Set dedicated channel for level-up messages (Admin only)', options: [{ name: 'channel', type: 7, description: 'Channel for level-ups (leave empty to reset)', required: false }] },
      { name: 'level-config', description: 'View and configure XP settings (Admin only)' },
      { name: 'xp-boost', description: 'Set bonus XP for specific actions (Admin only)', options: [{ name: 'action', type: 3, description: 'Action type', required: true, choices: [{ name: 'Long Message (50+ words)', value: 'longMessage' }, { name: 'Stickers', value: 'sticker' }, { name: 'Replies', value: 'reply' }, { name: 'Attachments', value: 'attachment' }] }, { name: 'bonus', type: 4, description: 'Bonus XP amount', required: true }] },
      { name: 'no-xp-channel', description: 'Manage channels where users don\'t gain XP (Admin only)', options: [{ name: 'action', type: 3, description: 'Add or remove', required: true, choices: [{ name: 'Add Channel', value: 'add' }, { name: 'Remove Channel', value: 'remove' }, { name: 'List Channels', value: 'list' }] }, { name: 'channel', type: 7, description: 'Channel to add/remove', required: false }] },
      { name: 'no-xp-role', description: 'Manage roles that don\'t gain XP (Admin only)', options: [{ name: 'action', type: 3, description: 'Add or remove', required: true, choices: [{ name: 'Add Role', value: 'add' }, { name: 'Remove Role', value: 'remove' }, { name: 'List Roles', value: 'list' }] }, { name: 'role', type: 8, description: 'Role to add/remove', required: false }] },
      { name: 'toggle-levelup-mention', description: 'Toggle level-up mentions for yourself', options: [{ name: 'enabled', type: 5, description: 'Enable or disable mentions', required: true }] },
      
      // WELCOME & GOODBYE
      { name: 'welcome-setup', description: 'Set up welcome messages (Admin only)', options: [{ name: 'channel', type: 7, description: 'Channel to send welcome messages', required: true }] },
      { name: 'welcome-message', description: 'Set welcome message (Admin only)', options: [{ name: 'message', type: 3, description: 'Use: {user}, {mention}, {server}, {membercount}', required: true }] },
      { name: 'welcome-toggle', description: 'Enable/disable welcome messages (Admin only)', options: [{ name: 'enabled', type: 5, description: 'Enable or disable', required: true }] },
      { name: 'goodbye-setup', description: 'Set up goodbye messages (Admin only)', options: [{ name: 'channel', type: 7, description: 'Channel to send goodbye messages', required: true }] },
      { name: 'goodbye-message', description: 'Set goodbye message (Admin only)', options: [{ name: 'message', type: 3, description: 'Use: {user}, {server}', required: true }] },
      { name: 'goodbye-toggle', description: 'Enable/disable goodbye messages (Admin only)', options: [{ name: 'enabled', type: 5, description: 'Enable or disable', required: true }] },
      { name: 'auto-role', description: 'Set auto-role given on join (Admin only)', options: [{ name: 'role', type: 8, description: 'Role to give on join', required: true }, { name: 'delay', type: 4, description: 'Delay in seconds (default: 0)', required: false }] },
      { name: 'remove-auto-role', description: 'Remove auto-role (Admin only)' },
      
      // REACTION ROLES
      { name: 'reaction-role', description: 'Add a reaction role (Admin only)', options: [{ name: 'message_id', type: 3, description: 'Message ID to add reaction to', required: true }, { name: 'emoji', type: 3, description: 'Emoji to react with', required: true }, { name: 'role', type: 8, description: 'Role to give', required: true }] },
      { name: 'remove-reaction-role', description: 'Remove a reaction role (Admin only)', options: [{ name: 'message_id', type: 3, description: 'Message ID', required: true }, { name: 'emoji', type: 3, description: 'Emoji', required: true }] },
      { name: 'list-reaction-roles', description: 'List all reaction roles (Admin only)' },
      
      // AUTO-MODERATION
      { name: 'automod-toggle', description: 'Enable/disable auto-moderation (Admin only)', options: [{ name: 'feature', type: 3, description: 'Feature to toggle', required: true, choices: [{ name: 'All Auto-Mod', value: 'enabled' }, { name: 'Spam Detection', value: 'spam' }, { name: 'Mass Mentions', value: 'mass_mention' }, { name: 'Caps Lock', value: 'caps' }, { name: 'Link Spam', value: 'link_spam' }, { name: 'Invite Links', value: 'invites' }, { name: 'Duplicate Messages', value: 'duplicate' }, { name: 'Anti-Raid', value: 'anti_raid' }] }, { name: 'enabled', type: 5, description: 'Enable or disable', required: true }] },
      { name: 'automod-config', description: 'View auto-moderation configuration (Admin only)' },
      { name: 'automod-ignore-role', description: 'Make a role exempt from auto-mod (Admin only)', options: [{ name: 'role', type: 8, description: 'Role to ignore', required: true }] },
      { name: 'automod-ignore-channel', description: 'Make a channel exempt from auto-mod (Admin only)', options: [{ name: 'channel', type: 7, description: 'Channel to ignore', required: true }] },
    ];

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands },
    );

    console.log(`✅ Successfully registered ${commands.length} commands!\n`);
    console.log('🎯 Level commands that are now registered:');
    console.log('   ✓ /level-channel');
    console.log('   ✓ /level-config');
    console.log('   ✓ /xp-boost');
    console.log('   ✓ /no-xp-channel');
    console.log('   ✓ /no-xp-role');
    console.log('   ✓ /toggle-levelup-mention');
    console.log('\n⏱️  Wait 1-2 minutes, then try typing /level-channel in Discord!');
    console.log('💡 If it still doesn\'t appear, try:');
    console.log('   1. Restart Discord (Ctrl+R or close/reopen)');
    console.log('   2. Type the full command: /level-channel');
    console.log('   3. Check in a different server (if bot is in multiple)');
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (error.code === 50001) {
      console.error('\n💡 This error means the bot lacks OAuth2 permissions.');
      console.error('   Re-invite your bot with this scope: applications.commands');
    }
  }
}

clearAndRegister();
