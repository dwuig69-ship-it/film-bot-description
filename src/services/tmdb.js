/**
 * FILE: src/services/tmdb.js
 * TUJUAN: Client TMDB. Cari film lalu ambil detail lengkap.
 * DIPAKAI OLEH: handlers/messageCreate.js
 * DEPENDENSI: config.js, fetch bawaan Node 18+
 * FUNGSI:
 *   - getMovieByTitle(query) -> detail film | null
 * SIDE EFFECT: HTTP call ke api.themoviedb.org (2 request, +1 hanya jika sinopsis id kosong).
 *   Tanpa DB, tanpa file I/O.
 */
const { tmdbApiKey } = require('../config');

const BASE = 'https://api.themoviedb.org/3';

async function get(path, params = {}) {
  const url = new URL(BASE + path);
  url.search = new URLSearchParams({ api_key: tmdbApiKey, ...params }).toString();
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`TMDB ${res.status} pada ${path}`);
  return res.json();
}

async function getMovieByTitle(query) {
  const search = await get('/search/movie', { query, language: 'id-ID', include_adult: 'false' });
  const hit = search.results?.[0];
  if (!hit) return null;

  const movie = await get(`/movie/${hit.id}`, {
    language: 'id-ID',
    append_to_response: 'credits,videos',
    include_video_language: 'id,en,null',
  });

  if (!movie.overview) {
    const en = await get(`/movie/${hit.id}`, { language: 'en-US' });
    movie.overview = en.overview || '';
  }
  return movie;
}

module.exports = { getMovieByTitle };
