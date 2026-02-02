import dotenv from 'dotenv';
dotenv.config();
import { REST, Routes } from "discord.js";

const CLIENT_ID = process.env.CLIENT_ID;
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

console.log('🔍 Testing Discord API Connection...');

if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error('❌ Missing env variables!');
  process.exit(1);
}

// Create REST with longer timeout and retry logic
const rest = new REST({ 
  version: '10',
  api: 'https://discord.com/api',
  rejectOnRateLimit: false,
  timeout: 30000 // 30 seconds
}).setToken(DISCORD_TOKEN);

const commands = [
  { name: 'rank', description: 'Check XP and level' },
  { name: 'leaderboard', description: 'View XP leaderboard' },
  { name: 'level-config', description: 'Configure leveling system' }
];

async function register() {
  try {
    console.log('⏳ Registering commands...');
    console.time('Registration');
    
    const result = await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    
    console.timeEnd('Registration');
    console.log(`✅ Success! Registered ${result.length} commands`);
    console.log('Commands:', result.map(c => c.name).join(', '));
    
  } catch (error) {
    console.error('\n❌ Error Details:');
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    
    if (error.status === 401) {
      console.error('\n🔑 Your DISCORD_TOKEN is invalid or expired!');
      console.error('Get a new token from: https://discord.com/developers/applications');
    } else if (error.status === 403) {
      console.error('\n🚫 Bot lacks permission! Re-invite with this URL:');
      console.error(`https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&scope=bot%20applications.commands&permissions=8`);
    } else if (error.status === 429) {
      console.error('\n⏳ Rate limited! Wait 1 hour before trying again.');
    }
  }
}

register();