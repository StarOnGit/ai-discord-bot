// test-api.js
import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
rest.get(Routes.applicationCommands(process.env.CLIENT_ID))
  .then(cmds => console.log('✅ Working! Current commands:', cmds.map(c => c.name)))
  .catch(err => console.error('❌ Failed:', err.message));