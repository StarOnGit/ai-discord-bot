// Register slash commands - Run this once with: node register-commands.js
import { REST, Routes, PermissionFlagsBits } from 'discord.js';
import 'dotenv/config';

const commands = [
  // Basic Commands
  {
    name: 'commands',
    description: 'Show all available commands with interactive categories',
  },
  {
    name: 'chat',
    description: 'Chat with Mai',
    options: [
      {
        name: 'message',
        type: 3, // STRING
        description: 'Your message to Mai',
        required: true,
      },
    ],
  },
  {
    name: 'personality',
    description: 'Change Mai\'s personality mode (Admin/Mod only)',
    options: [
      {
        name: 'mode',
        type: 3, // STRING
        description: 'Select a personality mode',
        required: false,
        choices: [
          { name: 'Normal', value: 'normal' },
          { name: 'Shakespearean', value: 'shakespearean' },
          { name: 'Anime', value: 'anime' },
          { name: 'Pirate', value: 'pirate' },
          { name: 'Formal', value: 'formal' },
          { name: 'Gen Z', value: 'gen_z' },
          { name: 'Hinglish', value: 'hinglish' },
          { name: 'UwU', value: 'uwu' },
          { name: 'Southern', value: 'southern' },
          { name: 'Aussie', value: 'aussie' },
          { name: 'Roast', value: 'roast' },
          { name: 'ChatGayPT', value: 'chatgaypt' },
        ],
      },
    ],
  },
  {
    name: 'memory',
    description: 'View what Mai remembers about this server',
  },
  {
    name: 'forget',
    description: 'Forget conversation in this channel',
  },
  {
    name: 'myid',
    description: 'Get your Discord user ID',
  },
  {
    name: 'list-personalities',
    description: 'List all available personality modes',
  },
  
  // Filter Commands
  {
    name: 'nsfw-filter',
    description: 'Toggle NSFW filter (Admin/Mod only)',
    options: [
      {
        name: 'enabled',
        type: 5, // BOOLEAN
        description: 'Enable or disable NSFW filter',
        required: true,
      },
    ],
  },
  {
    name: 'profanity-filter',
    description: 'Toggle profanity filter (Admin/Mod only)',
    options: [
      {
        name: 'enabled',
        type: 5, // BOOLEAN
        description: 'Enable or disable profanity filter',
        required: true,
      },
    ],
  },
  
  // Configuration Commands
  {
    name: 'config',
    description: 'View bot configuration for this server',
  },
  {
    name: 'clear-memory',
    description: 'Clear all server memory (Admin/Mod only)',
  },
  
  // Role Restriction Commands
  {
    name: 'role-restriction',
    description: 'Configure role restrictions (Admin/Mod only)',
    options: [
      {
        name: 'action',
        type: 3, // STRING
        description: 'Action to perform',
        required: true,
        choices: [
          { name: 'Enable', value: 'enable' },
          { name: 'Disable', value: 'disable' },
          { name: 'Set Whitelist Mode', value: 'whitelist' },
          { name: 'Set Blacklist Mode', value: 'blacklist' },
          { name: 'View Status', value: 'status' },
        ],
      },
    ],
  },
  {
    name: 'allow-role',
    description: 'Add role to whitelist (Admin/Mod only)',
    options: [
      {
        name: 'role',
        type: 8, // ROLE
        description: 'Role to allow',
        required: true,
      },
    ],
  },
  {
    name: 'block-role',
    description: 'Add role to blacklist (Admin/Mod only)',
    options: [
      {
        name: 'role',
        type: 8, // ROLE
        description: 'Role to block',
        required: true,
      },
    ],
  },
  {
    name: 'remove-role',
    description: 'Remove role from restrictions (Admin/Mod only)',
    options: [
      {
        name: 'role',
        type: 8, // ROLE
        description: 'Role to remove',
        required: true,
      },
    ],
  },
  {
    name: 'list-roles',
    description: 'List all role restrictions (Admin/Mod only)',
  },
  {
    name: 'clear-roles',
    description: 'Clear all role restrictions (Admin/Mod only)',
  },
  
  // Channel Restriction Commands
  {
    name: 'channel-restriction',
    description: 'Configure channel restrictions (Admin/Mod only)',
    options: [
      {
        name: 'action',
        type: 3, // STRING
        description: 'Action to perform',
        required: true,
        choices: [
          { name: 'Enable', value: 'enable' },
          { name: 'Disable', value: 'disable' },
          { name: 'Allow This Channel', value: 'allow' },
          { name: 'Block This Channel', value: 'block' },
          { name: 'View Status', value: 'status' },
        ],
      },
      {
        name: 'channel',
        type: 7, // CHANNEL
        description: 'Channel to allow/block (optional, uses current if not specified)',
        required: false,
      },
    ],
  },
  {
    name: 'allow-channel',
    description: 'Allow a specific channel (Admin/Mod only)',
    options: [
      {
        name: 'channel',
        type: 7, // CHANNEL
        description: 'Channel to allow',
        required: true,
      },
    ],
  },
  {
    name: 'block-channel',
    description: 'Block a specific channel (Admin/Mod only)',
    options: [
      {
        name: 'channel',
        type: 7, // CHANNEL
        description: 'Channel to block',
        required: true,
      },
    ],
  },
  {
    name: 'list-channels',
    description: 'List all channel restrictions (Admin/Mod only)',
  },
  {
    name: 'clear-channels',
    description: 'Clear all channel restrictions (Admin/Mod only)',
  },
  
  // Password Commands
  {
    name: 'set-password',
    description: 'Set password protection (Admin/Mod only)',
    options: [
      {
        name: 'password',
        type: 3, // STRING
        description: 'Password to set',
        required: true,
      },
    ],
  },
  {
    name: 'remove-password',
    description: 'Remove password protection (Admin/Mod only)',
  },
  {
    name: 'show-password',
    description: 'Show current password (Admin/Mod only)',
  },
  
  // Language Commands
  {
    name: 'language',
    description: 'Set bot response language (Admin/Mod only)',
    options: [
      {
        name: 'lang',
        type: 3, // STRING
        description: 'Language to use',
        required: true,
        choices: [
          { name: 'English', value: 'english' },
          { name: 'Spanish', value: 'spanish' },
          { name: 'French', value: 'french' },
          { name: 'Hindi', value: 'hindi' },
          { name: 'Japanese', value: 'japanese' },
          { name: 'German', value: 'german' },
        ],
      },
    ],
  },
  
  // Admin Role Commands
  {
    name: 'add-admin-role',
    description: 'Add role as admin (Admin/Mod only)',
    options: [
      {
        name: 'role',
        type: 8, // ROLE
        description: 'Role to add as admin',
        required: true,
      },
    ],
  },
  {
    name: 'remove-admin-role',
    description: 'Remove admin role (Admin/Mod only)',
    options: [
      {
        name: 'role',
        type: 8, // ROLE
        description: 'Role to remove from admins',
        required: true,
      },
    ],
  },
  
  // Keyword Commands
  {
    name: 'set-keyword',
    description: 'Set required keyword (Admin/Mod only)',
    options: [
      {
        name: 'keyword',
        type: 3, // STRING
        description: 'Keyword that messages must contain',
        required: true,
      },
    ],
  },
  {
    name: 'remove-keyword',
    description: 'Remove keyword requirement (Admin/Mod only)',
  },
  
  // Bot Control Commands
  {
    name: 'enable-bot',
    description: 'Enable bot responses (Admin/Mod only)',
  },
  {
    name: 'disable-bot',
    description: 'Disable bot responses (Admin/Mod only)',
  },
  {
    name: 'lock-bot',
    description: 'Lock bot to admins only (Admin/Mod only)',
  },
  {
    name: 'unlock-bot',
    description: 'Unlock bot for everyone (Admin/Mod only)',
  },
  
  // Owner Commands
  {
    name: 'clear-verified',
    description: 'Clear all verified users (Owner only)',
  },
  // Moderation Commands
  {
    name: 'slowmode',
    description: 'Set slowmode for the channel (Mod only)',
    options: [
      {
        name: 'duration',
        type: 4, // INTEGER
        description: 'Slowmode duration in seconds (0-21600)',
        required: false,
        min_value: 0,
        max_value: 21600,
      },
      {
        name: 'custom',
        type: 3, // STRING
        description: 'Custom duration (e.g., 5m, 1h, 30s) - overrides duration',
        required: false,
      },
    ],
  },
  {
    name: 'lock',
    description: 'Lock the channel (Mod only)',
  },
  {
    name: 'unlock',
    description: 'Unlock the channel (Mod only)',
  },
  {
    name: 'warn',
    description: 'Warn a user (Mod only)',
    options: [
      {
        name: 'user',
        type: 6, // USER
        description: 'User to warn',
        required: true,
      },
      {
        name: 'reason',
        type: 3, // STRING
        description: 'Reason for the warning',
        required: true,
      },
      {
        name: 'dm',
        type: 5, // BOOLEAN
        description: 'Send DM to user?',
        required: false,
      },
    ],
  },
  {
    name: 'mute',
    description: 'Timeout a user (Mod only)',
    options: [
      {
        name: 'user',
        type: 6, // USER
        description: 'User to mute',
        required: true,
      },
      {
        name: 'duration',
        type: 3, // STRING
        description: 'Duration (e.g., 10m, 1h, 1d)',
        required: true,
      },
      {
        name: 'reason',
        type: 3, // STRING
        description: 'Reason for the mute',
        required: false,
      },
      {
        name: 'dm',
        type: 5, // BOOLEAN
        description: 'Send DM to user?',
        required: false,
      },
    ],
  },
  {
    name: 'unmute',
    description: 'Remove timeout from a user (Mod only)',
    options: [
      {
        name: 'user',
        type: 6, // USER
        description: 'User to unmute',
        required: true,
      },
      {
        name: 'dm',
        type: 5, // BOOLEAN
        description: 'Send DM to user?',
        required: false,
      },
    ],
  },
  {
    name: 'warnings',
    description: 'View warnings for a user (Mod only)',
    options: [
      {
        name: 'user',
        type: 6, // USER
        description: 'User to check warnings for',
        required: true,
      },
    ],
  },
  {
    name: 'kick',
    description: 'Kick a user from the server (Mod only)',
    options: [
      {
        name: 'user',
        type: 6, // USER
        description: 'User to kick',
        required: true,
      },
      {
        name: 'reason',
        type: 3, // STRING
        description: 'Reason for the kick',
        required: false,
      },
      {
        name: 'dm',
        type: 5, // BOOLEAN
        description: 'Send DM to user?',
        required: false,
      },
    ],
  },
  {
    name: 'ban',
    description: 'Ban a user from the server (Mod only)',
    options: [
      {
        name: 'user',
        type: 6, // USER
        description: 'User to ban',
        required: true,
      },
      {
        name: 'reason',
        type: 3, // STRING
        description: 'Reason for the ban',
        required: false,
      },
      {
        name: 'delete_days',
        type: 4, // INTEGER
        description: 'Delete messages from last X days (0-7)',
        required: false,
        min_value: 0,
        max_value: 7,
      },
      {
        name: 'dm',
        type: 5, // BOOLEAN
        description: 'Send DM to user?',
        required: false,
      },
    ],
  },
  {
    name: 'unban',
    description: 'Unban a user from the server (Mod only)',
    options: [
      {
        name: 'user',
        type: 6, // USER
        description: 'User to unban',
        required: true,
      },
      {
        name: 'reason',
        type: 3, // STRING
        description: 'Reason for the unban',
        required: false,
      },
    ],
  },
  {
    name: 'set-log-channel',
    description: 'Set the moderation log channel (Admin only)',
    options: [
      {
        name: 'channel',
        type: 7, // CHANNEL
        description: 'Channel to log moderation actions',
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔄 Started refreshing application (/) commands.');

    // Use CLIENT_ID from .env if available, otherwise we'll need to get it from the bot
    const clientId = process.env.CLIENT_ID || process.env.DISCORD_CLIENT_ID;
    
    if (!clientId) {
      console.error('❌ Error: CLIENT_ID or DISCORD_CLIENT_ID not found in .env file!');
      console.error('   Please add CLIENT_ID=your_bot_client_id to your .env file');
      process.exit(1);
    }

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log('✅ Successfully reloaded application (/) commands.');
    console.log(`📊 Registered ${commands.length} commands!`);
  } catch (error) {
    console.error('❌ Error registering commands:', error);
  }
})();
