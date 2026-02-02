// ═══════════════════════════════════════════════
// 📋 EVENT HANDLERS FOR ALL NEW SYSTEMS
// Add these to your index.js
// ═══════════════════════════════════════════════

// ═══════════════════════════════════════════════
// 📊 LEVELING SYSTEM - Message Handler
// ═══════════════════════════════════════════════
client.on('messageCreate', async (message) => {
  // Ignore bots and DMs
  if (message.author.bot || !message.guild) return;
  
  const guildId = message.guild.id;
  const userId = message.author.id;
  const channelId = message.channel.id;
  
  // Get leveling config
  const levelConfig = getGuildLevelConfig(guildId);
  if (!levelConfig.enabled) return;
  
  // Check if channel/role is ignored
  if (levelConfig.noXpChannels?.includes(channelId)) return;
  
  const member = message.member;
  if (member && levelConfig.noXpRoles) {
    for (const roleId of levelConfig.noXpRoles) {
      if (member.roles.cache.has(roleId)) return;
    }
  }
  
  // Get user data
  const userData = getUserLevel(guildId, userId);
  
  // Check cooldown
  const now = Date.now();
  if (now - userData.lastXpGain < levelConfig.xpCooldown) return;
  
  // Calculate XP to give
  const xpAmount = Math.floor(levelConfig.xpPerMessage * levelConfig.xpMultiplier);
  
  // Add XP
  const result = addXp(guildId, userId, xpAmount);
  
  // Check for level up
  if (result.leveledUp && levelConfig.announceLevelUp) {
    const levelUpEmbed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🎉 LEVEL UP!')
      .setDescription(`${message.author} just reached **Level ${result.newLevel}**!`)
      .addFields(
        { name: 'Progress', value: `${result.currentXp}/${result.xpNeeded} XP`, inline: true },
        { name: 'Total XP', value: result.totalXp.toString(), inline: true }
      )
      .setThumbnail(message.author.displayAvatarURL())
      .setTimestamp();
    
    // Check for role rewards
    const roleRewards = getRoleRewards(guildId);
    if (roleRewards[result.newLevel]) {
      const roleId = roleRewards[result.newLevel];
      const role = message.guild.roles.cache.get(roleId);
      
      if (role && member) {
        try {
          await member.roles.add(role);
          levelUpEmbed.addFields({
            name: '⭐ Reward Unlocked!',
            value: `You earned the ${role} role!`
          });
        } catch (error) {
          console.error('Error adding role reward:', error);
        }
      }
    }
    
    // Send level up message
    const levelUpChannel = levelConfig.levelUpChannel 
      ? message.guild.channels.cache.get(levelConfig.levelUpChannel)
      : message.channel;
    
    if (levelUpChannel) {
      await levelUpChannel.send({ embeds: [levelUpEmbed] });
    }
  }
});

// ═══════════════════════════════════════════════
// 👋 WELCOME SYSTEM - Member Join Handler
// ═══════════════════════════════════════════════
client.on('guildMemberAdd', async (member) => {
  const guildId = member.guild.id;
  
  // Track join for anti-raid
  trackJoin(guildId);
  
  // Check for raid
  const automodConfig = getGuildAutomodConfig(guildId);
  if (automodConfig.antiRaidEnabled) {
    const raidCheck = checkAntiRaid(guildId, automodConfig);
    if (raidCheck) {
      console.log(`🚨 RAID DETECTED in ${member.guild.name}!`);
      
      // Take action based on config
      if (raidCheck.action === 'kick') {
        try {
          await member.kick('Anti-raid: Suspicious join pattern');
        } catch (error) {
          console.error('Error kicking during raid:', error);
        }
      } else if (raidCheck.action === 'ban') {
        try {
          await member.ban({ reason: 'Anti-raid: Suspicious join pattern' });
        } catch (error) {
          console.error('Error banning during raid:', error);
        }
      }
      
      // Lock server if configured
      if (raidCheck.lockdown && automodConfig.antiRaidLockdown) {
        // Lock all channels
        const channels = member.guild.channels.cache.filter(c => c.isTextBased());
        for (const [, channel] of channels) {
          try {
            await channel.permissionOverwrites.edit(member.guild.roles.everyone, {
              SendMessages: false
            });
          } catch (error) {
            console.error('Error locking channel during raid:', error);
          }
        }
      }
      
      return; // Skip welcome for raid members
    }
  }
  
  // Get welcome config
  const welcomeConfig = getGuildWelcomeConfig(guildId);
  
  // Send welcome message
  if (welcomeConfig.welcomeEnabled && welcomeConfig.welcomeChannel) {
    const channel = member.guild.channels.cache.get(welcomeConfig.welcomeChannel);
    
    if (channel) {
      if (welcomeConfig.welcomeEmbed) {
        const embed = new EmbedBuilder()
          .setColor(welcomeConfig.welcomeEmbedColor || '#5865F2')
          .setTitle(replacePlaceholders(welcomeConfig.welcomeEmbedTitle, member, member.guild))
          .setDescription(replacePlaceholders(welcomeConfig.welcomeEmbedDescription, member, member.guild))
          .setTimestamp();
        
        if (welcomeConfig.welcomeEmbedThumbnail) {
          embed.setThumbnail(member.user.displayAvatarURL());
        }
        
        if (welcomeConfig.welcomeEmbedImage) {
          embed.setImage(welcomeConfig.welcomeEmbedImage);
        }
        
        await channel.send({ embeds: [embed] });
      } else {
        const message = replacePlaceholders(welcomeConfig.welcomeMessage, member, member.guild);
        await channel.send(message);
      }
    }
  }
  
  // Send DM welcome
  if (welcomeConfig.dmWelcome) {
    try {
      const dmMessage = replacePlaceholders(welcomeConfig.dmWelcomeMessage, member, member.guild);
      await member.send(dmMessage);
    } catch (error) {
      console.log('Could not DM welcome message:', error.message);
    }
  }
  
  // Auto-role
  if (welcomeConfig.autoRole) {
    const role = member.guild.roles.cache.get(welcomeConfig.autoRole);
    
    if (role) {
      const delay = welcomeConfig.autoRoleDelay || 0;
      
      setTimeout(async () => {
        try {
          await member.roles.add(role);
        } catch (error) {
          console.error('Error adding auto-role:', error);
        }
      }, delay * 1000);
    }
  }
});

// ═══════════════════════════════════════════════
// 👋 GOODBYE SYSTEM - Member Leave Handler
// ═══════════════════════════════════════════════
client.on('guildMemberRemove', async (member) => {
  const guildId = member.guild.id;
  const welcomeConfig = getGuildWelcomeConfig(guildId);
  
  if (!welcomeConfig.goodbyeEnabled || !welcomeConfig.goodbyeChannel) return;
  
  const channel = member.guild.channels.cache.get(welcomeConfig.goodbyeChannel);
  if (!channel) return;
  
  if (welcomeConfig.goodbyeEmbed) {
    const embed = new EmbedBuilder()
      .setColor(welcomeConfig.goodbyeEmbedColor || '#ED4245')
      .setTitle(replacePlaceholders(welcomeConfig.goodbyeEmbedTitle, member, member.guild))
      .setDescription(replacePlaceholders(welcomeConfig.goodbyeEmbedDescription, member, member.guild))
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp();
    
    await channel.send({ embeds: [embed] });
  } else {
    const message = replacePlaceholders(welcomeConfig.goodbyeMessage, member, member.guild);
    await channel.send(message);
  }
});

// ═══════════════════════════════════════════════
// 🎭 REACTION ROLES - Add Handler
// ═══════════════════════════════════════════════
client.on('messageReactionAdd', async (reaction, user) => {
  // Ignore bot reactions
  if (user.bot) return;
  
  // Fetch partial reactions
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Error fetching reaction:', error);
      return;
    }
  }
  
  const guildId = reaction.message.guild?.id;
  if (!guildId) return;
  
  const messageId = reaction.message.id;
  const emoji = reaction.emoji.name;
  
  // Check if this is a reaction role
  const roleId = getReactionRole(guildId, messageId, emoji);
  if (!roleId) return;
  
  const member = reaction.message.guild.members.cache.get(user.id);
  if (!member) return;
  
  const role = reaction.message.guild.roles.cache.get(roleId);
  if (!role) return;
  
  try {
    await member.roles.add(role);
    console.log(`✅ Gave ${role.name} to ${user.tag}`);
  } catch (error) {
    console.error('Error adding reaction role:', error);
  }
});

// ═══════════════════════════════════════════════
// 🎭 REACTION ROLES - Remove Handler
// ═══════════════════════════════════════════════
client.on('messageReactionRemove', async (reaction, user) => {
  if (user.bot) return;
  
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error('Error fetching reaction:', error);
      return;
    }
  }
  
  const guildId = reaction.message.guild?.id;
  if (!guildId) return;
  
  const messageId = reaction.message.id;
  const emoji = reaction.emoji.name;
  
  const roleId = getReactionRole(guildId, messageId, emoji);
  if (!roleId) return;
  
  const member = reaction.message.guild.members.cache.get(user.id);
  if (!member) return;
  
  const role = reaction.message.guild.roles.cache.get(roleId);
  if (!role) return;
  
  try {
    await member.roles.remove(role);
    console.log(`❌ Removed ${role.name} from ${user.tag}`);
  } catch (error) {
    console.error('Error removing reaction role:', error);
  }
});

// ═══════════════════════════════════════════════
// 🛡️ AUTO-MODERATION - Message Handler
// ═══════════════════════════════════════════════
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  
  const guildId = message.guild.id;
  const automodConfig = getGuildAutomodConfig(guildId);
  
  if (!automodConfig.enabled) return;
  
  // Check if ignored
  if (isIgnored(automodConfig, message.member, message.channel.id)) return;
  
  const userId = message.author.id;
  const content = message.content;
  
  let violation = null;
  
  // Check all rules
  if (!violation) violation = checkSpam(userId, guildId, automodConfig);
  if (!violation) violation = checkMassMention(message, automodConfig);
  if (!violation) violation = checkCaps(content, automodConfig);
  if (!violation) violation = checkLinkSpam(content, automodConfig);
  if (!violation) violation = checkInvites(content, automodConfig);
  if (!violation) violation = checkDuplicate(userId, content, guildId, automodConfig);
  
  if (violation) {
    console.log(`🛡️ Auto-mod violation: ${violation.violation} by ${message.author.tag}`);
    
    // Take action
    switch (violation.action) {
      case 'delete':
        try {
          await message.delete();
        } catch (error) {
          console.error('Error deleting message:', error);
        }
        break;
      
      case 'warn':
        // Use your existing warning system
        addWarning(guildId, userId, `Auto-mod: ${violation.reason}`, client.user.id);
        break;
      
      case 'mute':
        try {
          const member = message.member;
          if (member && violation.duration) {
            await member.timeout(violation.duration, violation.reason);
          }
        } catch (error) {
          console.error('Error muting user:', error);
        }
        break;
      
      case 'kick':
        try {
          await message.member.kick(violation.reason);
        } catch (error) {
          console.error('Error kicking user:', error);
        }
        break;
      
      case 'ban':
        try {
          await message.member.ban({ reason: violation.reason });
        } catch (error) {
          console.error('Error banning user:', error);
        }
        break;
    }
    
    // Log to channel
    if (automodConfig.logChannel) {
      const logChannel = message.guild.channels.cache.get(automodConfig.logChannel);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('🛡️ Auto-Moderation Action')
          .addFields(
            { name: 'User', value: `${message.author} (${message.author.id})`, inline: true },
            { name: 'Violation', value: violation.violation, inline: true },
            { name: 'Action', value: violation.action, inline: true },
            { name: 'Reason', value: violation.reason },
            { name: 'Channel', value: `${message.channel}` }
          )
          .setTimestamp();
        
        await logChannel.send({ embeds: [logEmbed] });
      }
    }
  }
});
