import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const records = await locals.pb.collection('collection').getFullList({
		sort: '-created'
	});

	console.log(records);
	return { records };
};
