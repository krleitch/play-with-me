import type { PageServerLoad } from './$types';
import type { Playlist } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
  const records = await locals.pb.collection('playlist').getList(1, 20, {
    sort: '-created'
  });

  const playlists: Playlist[] = records.items.map((record: Playlist) => {
    return {
      id: record.id,
      title: record.title,
      artist: record.artist,
      lastPlayed: record.lastPlayed,
      tunings: record.tunings,
      genres: record.genres,
      instruments: record.instruments,
      tags: record.tags,
      created: record.created,
      updated: record.updated
    };
  });

  return {
    playlists: playlists
  };
};
