import type { PageServerLoad } from './$types';
import type { Playlist, Video } from '$lib/types';

type pbPlaylistRecord = Playlist & {
  expand: {
    video_via_playlist: Video[];
  };
};

export const load: PageServerLoad = async ({ locals }) => {
  const records = await locals.pb.collection('playlist').getList(1, 20, {
    sort: '-created',
    expand: 'video_via_playlist.playlist'
  });

  const playlists: Playlist[] = records.items.map((record: pbPlaylistRecord) => {
    return {
      id: record.id,
      title: record.title,
      artist: record.artist,
      lastPlayed: record.lastPlayed,
      tunings: record.tunings,
      genres: record.genres,
      instruments: record.instruments,
      created: record.created,
      updated: record.updated,
      videos: record.expand?.video_via_playlist?.map((video) => {
        return {
          id: video.id,
          title: video.title,
          artist: video.artist,
          created: video.created,
          tags: video.tags,
          updated: video.updated,
          youtubeId: video.youtubeId
        };
      })
    };
  });

  return {
    playlists: playlists
  };
};
