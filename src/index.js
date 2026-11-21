/**
 * FILE: src/index.js
 * TUJUAN: Entry point. Buat client Discord, pasang handler, login.
 * DIPAKAI OLEH: npm start
 * DEPENDENSI: discord.js, config.js, handlers/messageCreate.js
 * FUNGSI: bootstrap (tanpa export)
 * SIDE EFFECT: koneksi WebSocket ke Discord. Intent: Guilds, GuildMessages, MessageContent.
 */
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { discordToken } = require('./config');
const { onMessage } = require('./handlers/messageCreate');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (c) => console.log(`Login sebagai ${c.user.tag}`));
client.on(Events.MessageCreate, onMessage);

client.login(discordToken);
