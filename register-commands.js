import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

// Set this to a specific guild ID for instant testing, or leave null for global
const testGuildId = '1438954374926696562'; // Your test server

const commands = [
    {
        name: 'chat',
        description: 'Chat with the AI',
        options: [
            {
                name: 'message',
                type: 3, // STRING
                description: 'Your message to the AI',
                required: true
            }
        ]
    },
    {
        name: 'reset',
        description: 'Reset your conversation history'
    },
    {
        name: 'memory',
        description: 'View or manage your AI memory'
    },
    {
        name: 'level',
        description: 'Check your level and XP'
    },
    {
        name: 'leaderboard',
        description: 'View the server leaderboard'
    },
    {
        name: 'config',
        description: 'Configure bot settings (admin only)'
    }
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('🔄 Started refreshing application (/) commands.');
        
        if (testGuildId) {
            // Guild-specific: Instant (good for testing)
            console.log(`📍 Registering to guild: ${testGuildId}`);
            await rest.put(
                Routes.applicationGuildCommands(clientId, testGuildId),
                { body: commands }
            );
            console.log('✅ Successfully registered guild commands (instant)!');
        } else {
            // Global: Takes 1 hour (good for production)
            console.log('🌍 Registering globally (may take 1 hour to appear)...');
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands }
            );
            console.log('✅ Successfully registered global commands!');
        }
        
        console.log(`📊 Total commands registered: ${commands.length}`);
    } catch (error) {
        console.error('❌ Error:', error);
    }
})();
