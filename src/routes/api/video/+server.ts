import { json } from '@sveltejs/kit';
import type { Video } from '$lib/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { playlistId, youtubeId, title, artist, tags, lastPlayed } = await request.json();

    const data = {
      title: title,
      artist: artist,
      youtubeId: youtubeId,
      lastPlayed: lastPlayed,
      tags: JSON.parse(tags),
      playlist: playlistId
    };

    const record: Video = await locals.pb.collection('video').create(data);

    return json({
      id: record.id,
      title: record.title,
      artist: record.artist,
      created: record.created,
      tags: record.tags,
      updated: record.updated,
      youtubeId: record.youtubeId
    });
  } catch (err: any) {
    return json({
      error: /** @type {Error} */ err.message
    });
  }
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  try {
    const { videoId } = await request.json();

    const record: Video = await locals.pb.collection('video').delete(videoId);

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
    const { videoId, playlistId, youtubeId, title, artist, tags, lastPlayed } = await request.json();

    const data = {
      title: title,
      artist: artist,
      youtubeId: youtubeId,
      lastPlayed: lastPlayed,
      tags: JSON.parse(tags),
      playlist: playlistId
    };

    const record: Video = await locals.pb.collection('video').update(videoId, data);

    return json({
      id: record.id,
      title: record.title,
      artist: record.artist,
      created: record.created,
      tags: record.tags,
      flags: record.flags,
      updated: record.updated,
      lastPlayed: record.lastPlayed,
      youtubeId: record.youtubeId
    });
  } catch (err: any) {
    return json({
      error: /** @type {Error} */ err.message
    });
  }
};
