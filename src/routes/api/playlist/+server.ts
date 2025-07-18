import { json } from '@sveltejs/kit';
import type { Playlist } from '$lib/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const formData: FormData = await request.formData();

    const data = {
      title: formData.get('title'),
      artist: formData.get('artist'),
      lastPlayed: new Date().toISOString(),
      tunings: formData.get('tunings'),
      instruments: formData.get('instruments'),
      genres: formData.get('genres')
    };

    const record: Playlist = await locals.pb.collection('playlist').create(data);

    return json({
      id: record.id,
      title: record.title,
      artist: record.artist,
      lastPlayed: record.lastPlayed,
      tunings: record.tunings,
      genres: record.genres,
      instruments: record.instruments,
      favourite: record.favourite,
      created: record.created,
      updated: record.updated,
      videos: [],
      notes: []
    });
  } catch (err: any) {
    return json({
      error: /** @type {Error} */ err.message
    });
  }
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  try {
    const { playlistId } = await request.json();

    const record: Playlist = await locals.pb.collection('playlist').delete(playlistId);

    return json({
      id: record.id
    });
  } catch (err: any) {
    return json({
      error: /** @type {Error} */ err.message
    });
  }
};

export const PATCH: RequestHandler = async ({ request, locals }) => {
  try {
    const formData: FormData = await request.formData();

    const playlistId = formData.get('playlistId');

    const data = {
      title: formData.get('title'),
      artist: formData.get('artist'),
      lastPlayed: new Date().toISOString(),
      tunings: formData.get('tunings'),
      instruments: formData.get('instruments'),
      genres: formData.get('genres')
    };

    const record: Playlist = await locals.pb.collection('playlist').update(playlistId, data);

    return json({
      id: record.id,
      title: record.title,
      artist: record.artist,
      lastPlayed: record.lastPlayed,
      tunings: record.tunings,
      genres: record.genres,
      instruments: record.instruments,
      favourite: record.favourite,
      created: record.created,
      updated: record.updated,
      videos: [],
      notes: record.notes
    });
  } catch (err: any) {
    return json({
      error: /** @type {Error} */ err.message
    });
  }
};
