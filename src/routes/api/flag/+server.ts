import { json } from '@sveltejs/kit';
import type { Flag } from '$lib/types';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const formData: FormData = await request.formData();

    const data = {
      name: formData.get('name'),
      time: formData.get('time'),
      video: formData.get('videoId'),
      seekCC: -1,
      seekSecondsBefore: 3,
      sendCC: -1,
      sendCCValue: -1,
      sendPC: -1
    };

    const record: Flag = await locals.pb.collection('flag').create(data);

    return json({
      id: record.id,
      name: record.name,
      time: record.time,
      seekCC: record.seekCC,
      seekSecondsBefore: record.seekSecondsBefore,
      sendCC: record.sendCC,
      sendCCValue: record.sendCCValue,
      sendPC: record.sendPC,
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

export const PATCH: RequestHandler = async ({ request, locals }) => {
  try {
    const { flagId, name, time, seekCC, seekSecondsBefore, sendCC, sendCCValue, sendPC } =
      await request.json();

    const data = {
      name: name,
      time: time,
      seekCC: seekCC,
      seekSecondsBefore: seekSecondsBefore,
      sendCC: sendCC,
      sendCCValue: sendCCValue,
      sendPC: sendPC
    };

    const record: Flag = await locals.pb.collection('flag').update(flagId, data);

    return json({
      id: record.id,
      name: record.name,
      time: record.time,
      seekCC: record.seekCC,
      seekSecondsBefore: record.seekSecondsBefore,
      sendCC: record.sendCC,
      sendCCValue: record.sendCCValue,
      sendPC: record.sendPC,
      created: record.created,
      updated: record.updated
    });
  } catch (err: any) {
    return json({
      error: /** @type {Error} */ err.message
    });
  }
};
