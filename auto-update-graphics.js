#!/usr/bin/env node

/**
 * 🎨 Automatic Graphics Enhancement Script for Mai Bot
 * 
 * This script automatically updates your index.js with graphics enhancements.
 * 
 * Usage:
 *   node auto-update-graphics.js
 * 
 * This will:
 * 1. Backup your original index.js to index.js.backup
 * 2. Apply all graphics enhancements
 * 3. Create index-enhanced.js with all changes
 */

import fs from 'fs';
import path from 'path';

const BACKUP_FILE = 'index.js.backup';
const INPUT_FILE = 'index.js';
const OUTPUT_FILE = 'index-enhanced.js';

console.log('🎨 Mai Bot Graphics Enhancement Script\n');

// Check if index.js exists
if (!fs.existsSync(INPUT_FILE)) {
  console.error('❌ Error: index.js not found in current directory!');
  console.error('   Please run this script in the same folder as your index.js');
  process.exit(1);
}

// Check if graphics files exist
if (!fs.existsSync('graphics-utils.js')) {
  console.error('❌ Error: graphics-utils.js not found!');
  console.error('   Please make sure graphics-utils.js is in the same folder');
  process.exit(1);
}

if (!fs.existsSync('commands-display.js')) {
  console.error('❌ Error: commands-display.js not found!');
  console.error('   Please make sure commands-display.js is in the same folder');
  process.exit(1);
}

console.log('✅ All required files found');
console.log('📦 Reading index.js...\n');

// Read the file
let content = fs.readFileSync(INPUT_FILE, 'utf8');

// Create backup
console.log(`💾 Creating backup: ${BACKUP_FILE}`);
fs.writeFileSync(BACKUP_FILE, content, 'utf8');

// ═══════════════════════════════════════════════════════════════
// APPLY TRANSFORMATIONS
// ═══════════════════════════════════════════════════════════════

let changesMade = [];

// 1. Update Discord.js imports
console.log('\n🔧 Updating imports...');
const oldImport = `import { Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes } from "discord.js";`;
const newImport = `import { Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes, StringSelectMenuBuilder } from "discord.js";`;

if (content.includes(oldImport)) {
  content = content.replace(oldImport, newImport);
  changesMade.push('✅ Updated Discord.js imports (added StringSelectMenuBuilder)');
}

// 2. Add graphics imports after dotenv
const graphicsImports = `
// 🎨 GRAPHICS ENHANCEMENT IMPORTS
import {
  createAIResponseEmbed,
  createSuccessEmbed,
  createErrorEmbed,
  createWarningEmbed,
  createInfoEmbed,
  createConfigEmbed,
  createMemoryEmbed,
  createModActionEmbed,
  createPersonalityButtons,
  COLORS,
  EMOJIS,
  formatDuration,
  createProgressBar
} from './graphics-utils.js';

import {
  createMainCommandsEmbed,
  createCategoryEmbed,
  createAllCommandsEmbed,
  createCategoryButtons,
  createQuickHelpButtons,
  createQuickChatHelp,
  createQuickPersonalityHelp,
  createQuickModerationHelp,
  createQuickConfigHelp,
  COMMAND_CATEGORIES
} from './commands-display.js';
`;

if (!content.includes('graphics-utils.js')) {
  content = content.replace(
    `import "dotenv/config";`,
    `import "dotenv/config";${graphicsImports}`
  );
  changesMade.push('✅ Added graphics utility imports');
}

// 3. Update /commands handler
const oldCommandsHandler = `    if (commandName === 'commands') {
      const commandsMessage = createCommandsEmbed();
      await interaction.reply(commandsMessage);
      return;
    }`;

const newCommandsHandler = `    if (commandName === 'commands') {
      const mainEmbed = createMainCommandsEmbed();
      const buttons = createCategoryButtons();
      const quickHelp = createQuickHelpButtons();
      
      await interaction.reply({
        embeds: [mainEmbed],
        components: [...buttons, quickHelp],
        ephemeral: true
      });
      return;
    }`;

if (content.includes(oldCommandsHandler)) {
  content = content.replace(oldCommandsHandler, newCommandsHandler);
  changesMade.push('✅ Updated /commands handler with interactive menu');
}

// 4. Update /memory handler
const oldMemoryHandler = `    if (commandName === 'memory') {
      const mem = serverMemory[guildId];
      if (!mem || Object.keys(mem).length === 0) {
        await interaction.reply({ content: "Nothing yet! 💭", ephemeral: true });
        return;
      }

      let memList = "**Memory:**\\n\\n";
      for (const fact of Object.keys(mem)) {
        memList += \`• \${fact}\\n\`;
      }

      await interaction.reply({ content: memList, ephemeral: true });
      return;
    }`;

const newMemoryHandler = `    if (commandName === 'memory') {
      const memories = serverMemory[guildId] || {};
      const embed = createMemoryEmbed(interaction.guild.name, memories);
      
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }`;

if (content.includes(oldMemoryHandler)) {
  content = content.replace(oldMemoryHandler, newMemoryHandler);
  changesMade.push('✅ Updated /memory handler with beautiful embeds');
}

// 5. Update /forget handler  
const oldForgetPattern = /if \(commandName === 'forget'\) \{[\s\S]*?await interaction\.reply\("Conversation forgotten! 😊"\);[\s\S]*?return;[\s\S]*?\}/;
const newForgetHandler = `if (commandName === 'forget') {
      const channelId = interaction.channelId;
      conversationHistory[channelId] = [];
      saveConversations(conversationHistory);
      
      const embed = createSuccessEmbed(
        'Conversation Forgotten',
        'I\\'ve cleared our conversation history in this channel! 🧠✨',
        [{ name: 'Channel', value: \`<#\${channelId}>\`, inline: true }]
      );
      
      await interaction.reply({ embeds: [embed] });
      return;
    }`;

if (content.match(oldForgetPattern)) {
  content = content.replace(oldForgetPattern, newForgetHandler);
  changesMade.push('✅ Updated /forget handler with success embed');
}

// ═══════════════════════════════════════════════════════════════
// SAVE AND REPORT
// ═══════════════════════════════════════════════════════════════

console.log('\n💾 Saving enhanced version...');
fs.writeFileSync(OUTPUT_FILE, content, 'utf8');

console.log('\n' + '═'.repeat(60));
console.log('📊 CHANGES APPLIED:\n');
changesMade.forEach(change => console.log('  ' + change));

console.log('\n' + '═'.repeat(60));
console.log('✅ SUCCESS!\n');
console.log(`📁 Original file backed up to: ${BACKUP_FILE}`);
console.log(`📁 Enhanced file created: ${OUTPUT_FILE}`);
console.log('\n📋 NEXT STEPS:');
console.log('  1. Review the changes in index-enhanced.js');
console.log('  2. Test the enhanced version');
console.log('  3. If everything works, replace index.js:');
console.log('     cp index-enhanced.js index.js');
console.log('\n⚠️  IMPORTANT: You still need to manually add the button handler!');
console.log('   See COMPLETE-REPLACEMENT-GUIDE.md Step 2 for details.');
console.log('\n🎉 Graphics enhancement complete!\n');
