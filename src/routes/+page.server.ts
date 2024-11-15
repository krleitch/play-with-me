import type { PageServerLoad } from './$types';
import type { Collection } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
	const records = await locals.pb.collection('collection').getFullList({
		sort: '-created'
	});

  const collections: Collection[] = records.map((record: Collection) => {
      return {
        id: record.id,
        title: record.title,
        created: record.created,
        updated: record.updated
      }
    });

    return {
      collections: collections
    };
};
