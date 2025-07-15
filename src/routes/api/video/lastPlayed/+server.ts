import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request, locals }) => {
	try {
		const { videoId } = await request.json();

		const record = await locals.pb
			.collection('video')
			.update(videoId, { lastPlayed: new Date().toUTCString() });
		return json({
			...record
		});
	} catch (err: any) {
		return json({
			error: /** @type {Error} */ err.message
		});
	}
};
