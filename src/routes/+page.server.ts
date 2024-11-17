import type { PageServerLoad } from './$types';
import type { Video, Collection, Timestamp, Note } from '$lib/types';

type pbCollectionRecord = Collection & {
  expand: {
    videos: (Video & { expand: { timestamps: Timestamp[], notes: Note[] } })[];
  };
};

export const load: PageServerLoad = async ({ locals }) => {
  const records = await locals.pb.collection('collection').getList(1, 20, {
    sort: '-created',
    expand: 'videos, videos.timestamps, videos.notes'
  });

  const collections: Collection[] = records.items.map((record: pbCollectionRecord) => {
    return {
      id: record.id,
      title: record.title,
      artist: record.artist,
      lastPlayed: record.lastPlayed,
      tunings: record.tunings,
      genres: record.genres,
      instruments: record.instruments,
      tags: record.tags,
      created: record.created,
      updated: record.updated,
      videos: record.expand?.videos.map((video) => {
        return {
          id: video.id,
          title: video.title,
          artist: video.artist,
          created: video.created,
          tag: video.tag,
          updated: video.updated,
          youtubeId: video.youtubeId,
          timestamps: video.expand?.timestamps,
          notes: video.expand?.notes
        }
      })
    };
  });

  return {
    collections: collections
  };
};
