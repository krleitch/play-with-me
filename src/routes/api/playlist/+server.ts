import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
  try {
    const formData: FormData = await request.formData();

    const tunings = formData.get('tunings') as string;
    const instruments = formData.get('instruments') as string;
    const genres = formData.get('genres') as string;

    const data = {
      title: formData.get('title'),
      artist: formData.get('artist'),
      lastPlayed: new Date().toISOString(),
      tunings: tunings,
      instruments: instruments,
      genres: genres
    };

    const createPlaylistRecordModel = await locals.pb.collection('playlist').create(data);

    return json({
      data: { createPlaylistRecordModel }
    });
  } catch (err: any) {
    console.log('err', err);
    return json({
      error: /** @type {Error} */ err.message
    });
  }
}
