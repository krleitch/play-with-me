import { json } from '@sveltejs/kit';
import type { Flag } from '$lib/types';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request, locals }) => {
  try {
    const { flagId, disabled } = await request.json();

    const data = {
      disabled: disabled
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
      disabled: record.disabled,
      created: record.created,
      updated: record.updated
    });
  } catch (err: any) {
    return json({
      error: /** @type {Error} */ err.message
    });
  }
};
