import { json } from '@sveltejs/kit';
import type { Flag } from '$lib/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const formData: FormData = await request.formData();

    const data = {
      name: formData.get('name'),
      time: formData.get('time'),
      video: formData.get('videoId')
    };

    const record: Flag = await locals.pb.collection('flag').create(data);

    return json({
      id: record.id,
      name: record.name,
      time: record.time,
      seekMidi: record.seekMidi,
      sendMidi: record.sendMidi,
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
    const { flagId } = await request.json();

    const record: Flag = await locals.pb.collection('flag').delete(flagId);

    return json({
      id: record.id
    });
  } catch (err: any) {
    return json({
      error: /** @type {Error} */ err.message
    });
  }
};
