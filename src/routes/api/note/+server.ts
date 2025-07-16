import { json } from '@sveltejs/kit';
import type { Note } from '$lib/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { playlistId, title, message } = await request.json();

    const data = {
      title: title,
      message: message,
      playlist: playlistId
    };

    const record: Note = await locals.pb.collection('note').create(data);

    return json({
      id: record.id,
      title: record.title,
      message: record.message,
      created: record.created,
      updated: record.updated
    });
  } catch (err: any) {
    return json({
      error: /** @type {Error} */ err.message
    });
  }
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  try {
    const { noteId } = await request.json();

    const record: Note = await locals.pb.collection('note').delete(noteId);

    return json({
      id: record.id
    });
  } catch (err: any) {
    return json({
      error: /** @type {Error} */ err.message
    });
  }
};
