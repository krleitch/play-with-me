import { json } from '@sveltejs/kit';
import type { Playlist } from '$lib/types';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request, locals }) => {
  try {
    const { playlistId, favourite } = await request.json();

    const data = {
      favourite: favourite
    };

    const record: Playlist = await locals.pb.collection('playlist').update(playlistId, data);

    return json({
      id: record.id,
      title: record.title,
      artist: record.artist,
      lastPlayed: record.lastPlayed,
      tunings: record.tunings,
      genres: record.genres,
      views: record.views,
      instruments: record.instruments,
      favourite: record.favourite,
      created: record.created,
      updated: record.updated,
      videos: record.videos,
      notes: record.notes
    });
  } catch (err: any) {
    return json({
      error: /** @type {Error} */ err.message
    });
  }
};
