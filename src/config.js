/**
 * FILE: src/config.js
 * TUJUAN: Load dan validasi env, satu-satunya pintu akses process.env.
 * DIPAKAI OLEH: index.js, handlers/messageCreate.js, services/tmdb.js
 * DEPENDENSI: dotenv
 * FUNGSI: export { discordToken, tmdbApiKey, movieChannelId }
 * SIDE EFFECT: baca file .env; throw saat start jika ada env kosong.
 */
require('dotenv').config();

const need = ['DISCORD_TOKEN', 'TMDB_API_KEY', 'MOVIE_CHANNEL_ID'];
const missing = need.filter((k) => !process.env[k]);
if (missing.length) throw new Error(`Env belum diisi: ${missing.join(', ')}`);

module.exports = {
  discordToken: process.env.DISCORD_TOKEN,
  tmdbApiKey: process.env.TMDB_API_KEY,
  movieChannelId: process.env.MOVIE_CHANNEL_ID,
};
