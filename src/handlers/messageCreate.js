/**
 * FILE: src/handlers/messageCreate.js
 * TUJUAN: Tangani pesan masuk di channel film, cari film, balas dengan Component V2.
 * DIPAKAI OLEH: index.js (event messageCreate)
 * DEPENDENSI: services/tmdb.js, ui/movieContainer.js, config.js, discord.js
 * FUNGSI:
 *   - onMessage(message): filter bot/channel/panjang teks, lalu reply
 * SIDE EFFECT: HTTP call ke TMDB (via service), kirim pesan ke Discord. Tanpa DB/file I/O.
 */
const { MessageFlags } = require('discord.js');
const { movieChannelId } = require('../config');
const { getMovieByTitle } = require('../services/tmdb');
const { buildMovieContainer } = require('../ui/movieContainer');

const NO_PING = { repliedUser: false };

async function onMessage(message) {
  if (message.author.bot || message.channelId !== movieChannelId) return;
  const query = message.content.trim();
  if (!query || query.length > 100) return;

  try {
    const movie = await getMovieByTitle(query);
    if (!movie) {
      await message.reply({ content: `Film "${query}" tidak ditemukan.`, allowedMentions: NO_PING });
      return;
    }
    await message.reply({
      components: [buildMovieContainer(movie)],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: NO_PING,
    });
  } catch (err) {
    console.error('[film-bot]', err);
    await message.reply({ content: 'Gagal mengambil data film, coba lagi nanti.', allowedMentions: NO_PING });
  }
}

module.exports = { onMessage };
