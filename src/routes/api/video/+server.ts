import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { playlistId, youtubeId, title, artist, tags } = await request.json();

    const data = {
      title: title,
      artist: artist,
      youtubeId: youtubeId,
      lastPlayed: new Date().toISOString(),
      tags: JSON.parse(tags),
      playlist: playlistId
    };

    const record = await locals.pb.collection('video').create(data);

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
    console.log(err);
    return json({
      error: /** @type {Error} */ err.message
    });
  }
};

// export const DELETE: RequestHandler = async ({ request, locals }) => {
//   try {
//     const { playlistId } = await request.json();
//
//     const deletePlaylistRecordModel = await locals.pb.collection('playlist').delete(playlistId);
//
//     return json({
//       data: { deletePlaylistRecordModel }
//     });
//   } catch (err: any) {
//     return json({
//       error: /** @type {Error} */ err.message
//     });
//   }
// };
