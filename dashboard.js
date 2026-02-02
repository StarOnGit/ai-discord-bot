import "dotenv/config";
import express from "express";
import DiscordOauth2 from "discord-oauth2";
import session from "express-session";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.DASHBOARD_PORT || 3000;
const app = express();
const oauth = new DiscordOauth2();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'mai-bot-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
}));

// Helpers
const requireAuth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};

const requireGuildAdmin = (req, res, next) => {
  if (!req.session.guilds) return res.status(403).json({ error: 'No guilds' });
  const guild = req.session.guilds.find(g => g.id === req.params.guildId);
  if (!guild || !(BigInt(guild.permissions) & BigInt(0x8))) {
    return res.status(403).json({ error: 'Admin required' });
  }
  next();
};

const loadJson = (file) => {
  try { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : {}; }
  catch { return {}; }
};

const saveJson = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.redirect(oauth.generateAuthUrl({
  clientId: process.env.CLIENT_ID,
  redirectUri: `${process.env.DASHBOARD_URL || `http://localhost:${PORT}`}/callback`,
  scope: ['identify', 'guilds']
})));

app.get('/callback', async (req, res) => {
  try {
    const token = await oauth.tokenRequest({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      code: req.query.code,
      scope: ['identify', 'guilds'],
      grantType: 'authorization_code',
      redirectUri: `${process.env.DASHBOARD_URL || `http://localhost:${PORT}`}/callback`
    });
    req.session.user = await oauth.getUser(token.access_token);
    req.session.guilds = await oauth.getUserGuilds(token.access_token);
    res.redirect('/dashboard');
  } catch { res.redirect('/?error=auth'); }
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/'); });
app.get('/dashboard', requireAuth, (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/guild/:guildId', requireAuth, requireGuildAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public', 'guild.html')));

// API endpoints
app.get('/api/user', requireAuth, (req, res) => res.json({ user: req.session.user, guilds: req.session.guilds }));

// Bot Config
app.get('/api/guild/:guildId/config', requireAuth, requireGuildAdmin, (req, res) => {
  const config = loadJson('./bot-config.json');
  res.json({ bot: config[req.params.guildId] || getDefaultBotConfig() });
});

app.post('/api/guild/:guildId/config/bot', requireAuth, requireGuildAdmin, (req, res) => {
  const config = loadJson('./bot-config.json');
  config[req.params.guildId] = { ...(config[req.params.guildId] || getDefaultBotConfig()), ...req.body };
  saveJson('./bot-config.json', config);
  res.json({ success: true });
});

// Leveling Config
app.get('/api/guild/:guildId/config/leveling', requireAuth, requireGuildAdmin, (req, res) => {
  const config = loadJson('./level-config.json');
  res.json(config[req.params.guildId] || getDefaultLevelConfig());
});

app.post('/api/guild/:guildId/config/leveling', requireAuth, requireGuildAdmin, (req, res) => {
  const config = loadJson('./level-config.json');
  config[req.params.guildId] = { ...(config[req.params.guildId] || getDefaultLevelConfig()), ...req.body };
  saveJson('./level-config.json', config);
  res.json({ success: true });
});

// Auto-mod Config
app.get('/api/guild/:guildId/config/automod', requireAuth, requireGuildAdmin, (req, res) => {
  const config = loadJson('./automod-config.json');
  res.json(config[req.params.guildId] || getDefaultAutomodConfig());
});

app.post('/api/guild/:guildId/config/automod', requireAuth, requireGuildAdmin, (req, res) => {
  const config = loadJson('./automod-config.json');
  config[req.params.guildId] = { ...(config[req.params.guildId] || getDefaultAutomodConfig()), ...req.body };
  saveJson('./automod-config.json', config);
  res.json({ success: true });
});

// Welcome Config
app.get('/api/guild/:guildId/config/welcome', requireAuth, requireGuildAdmin, (req, res) => {
  const config = loadJson('./welcome-config.json');
  res.json(config[req.params.guildId] || getDefaultWelcomeConfig());
});

app.post('/api/guild/:guildId/config/welcome', requireAuth, requireGuildAdmin, (req, res) => {
  const config = loadJson('./welcome-config.json');
  config[req.params.guildId] = { ...(config[req.params.guildId] || getDefaultWelcomeConfig()), ...req.body };
  saveJson('./welcome-config.json', config);
  res.json({ success: true });
});

// Stats
app.get('/api/guild/:guildId/stats/leveling', requireAuth, requireGuildAdmin, (req, res) => {
  const levels = loadJson('./levels.json');
  const guildData = levels[req.params.guildId] || {};
  const users = Object.values(guildData);
  const totalXp = users.reduce((sum, u) => sum + (u.totalXp || 0), 0);
  res.json({ 
    totalUsers: users.length, 
    totalXp, 
    averageLevel: users.length ? Math.round((users.reduce((s, u) => s + (u.level || 0), 0) / users.length) * 10) / 10 : 0 
  });
});

function getDefaultBotConfig() { 
  return { 
    enabled: true, 
    language: 'english', 
    personality: 'normal', 
    nsfwFilter: true, 
    profanityFilter: true,
    ownerOnlyMode: false,
    roleRestriction: { enabled: false, mode: 'whitelist', allowedRoles: [], blockedRoles: [] },
    channelRestriction: { enabled: false, mode: 'whitelist', allowedChannels: [], blockedChannels: [] }
  }; 
}
function getDefaultLevelConfig() { return { enabled: true, xpPerMessage: 15, xpCooldown: 60000, announceLevelUp: true, mentionOnLevelUp: true, xpMultiplier: 1 }; }
function getDefaultAutomodConfig() { return { enabled: false, spamEnabled: true, massMentionEnabled: true, capsEnabled: true, invitesEnabled: false, antiRaidEnabled: false }; }
function getDefaultWelcomeConfig() { return { welcomeEnabled: false, welcomeChannel: null, welcomeMessage: 'Welcome {mention} to {server}!', goodbyeEnabled: false, goodbyeChannel: null, goodbyeMessage: '{user} has left.', autoRole: null }; }

app.listen(PORT, () => console.log(`🌐 Dashboard running on port ${PORT}`));