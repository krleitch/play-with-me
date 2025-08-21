import { json } from '@sveltejs/kit';
import type { Video } from '$lib/types';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request, locals }) => {
  try {
    const { videoId } = await request.json();

    const data = {
      lastPlayed: new Date().toISOString()
    };

    const record: Video = await locals.pb.collection('video').update(videoId, data);

    return json({
      id: record.id,
      title: record.title,
      artist: record.artist,
      lastPlayed: record.lastPlayed,
      created: record.created,
      updated: record.updated,
      flags: record.flags,
      tags: record.tags,
      youtubeId: record.youtubeId
    });
  } catch (err: any) {
    return json({
      error: /** @type {Error} */ err.message
    });
  }
};
