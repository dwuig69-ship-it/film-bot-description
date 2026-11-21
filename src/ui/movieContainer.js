/**
 * FILE: src/ui/movieContainer.js
 * TUJUAN: Ubah detail film TMDB menjadi Container Component V2 (murni tampilan).
 * DIPAKAI OLEH: handlers/messageCreate.js
 * DEPENDENSI: discord.js (builder Component V2)
 * FUNGSI:
 *   - buildMovieContainer(movie) -> ContainerBuilder
 * SIDE EFFECT: tidak ada (pure function).
 */
const {
  ContainerBuilder, SectionBuilder, TextDisplayBuilder, ThumbnailBuilder,
  SeparatorBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
} = require('discord.js');

const IMG = 'https://image.tmdb.org/t/p/';
const usd = (n) => (n ? `$${n.toLocaleString('en-US')}` : '-');
const cut = (s, n) => (s.length > n ? `${s.slice(0, n - 3)}...` : s);

function runtime(min) {
  if (!min) return '-';
  return `${Math.floor(min / 60)}j ${min % 60}m`;
}

function buildMovieContainer(m) {
  const year = m.release_date ? ` (${m.release_date.slice(0, 4)})` : '';
  const director = m.credits?.crew?.find((c) => c.job === 'Director')?.name || '-';
  const cast = (m.credits?.cast || []).slice(0, 6).map((c) => c.name).join(', ') || '-';
  const genres = (m.genres || []).map((g) => g.name).join(', ') || '-';
  const rating = m.vote_count ? `${m.vote_average.toFixed(1)}/10 (${m.vote_count.toLocaleString('id-ID')} suara)` : '-';

  const head = [
    `## ${m.title}${year}`,
    m.tagline ? `*${m.tagline}*` : null,
    `**Rating:** ${rating}`,
    `**Rilis:** ${m.release_date || '-'} | **Durasi:** ${runtime(m.runtime)}`,
    `**Genre:** ${genres}`,
    `**Status:** ${m.status || '-'}`,
  ].filter(Boolean).join('\n');

  const container = new ContainerBuilder().setAccentColor(0x01b4e4);

  if (m.poster_path) {
    container.addSectionComponents(
      new SectionBuilder()
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(head))
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(`${IMG}w342${m.poster_path}`)),
    );
  } else {
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(head));
  }

  container
    .addSeparatorComponents(new SeparatorBuilder())
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`**Sinopsis**\n${cut(m.overview || 'Belum ada sinopsis.', 900)}`),
      new TextDisplayBuilder().setContent(
        [
          `**Sutradara:** ${director}`,
          `**Pemeran:** ${cast}`,
          `**Anggaran:** ${usd(m.budget)} | **Pendapatan:** ${usd(m.revenue)}`,
        ].join('\n'),
      ),
    );

  if (m.backdrop_path) {
    container.addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(
        new MediaGalleryItemBuilder().setURL(`${IMG}w780${m.backdrop_path}`),
      ),
    );
  }

  const trailer = m.videos?.results?.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const buttons = [];
  if (trailer) {
    buttons.push(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Trailer')
      .setURL(`https://www.youtube.com/watch?v=${trailer.key}`));
  }
  buttons.push(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('TMDB')
    .setURL(`https://www.themoviedb.org/movie/${m.id}`));

  container
    .addActionRowComponents(new ActionRowBuilder().addComponents(buttons))
    .addTextDisplayComponents(new TextDisplayBuilder().setContent('-# Data dari TMDB'));

  return container;
}

module.exports = { buildMovieContainer };
