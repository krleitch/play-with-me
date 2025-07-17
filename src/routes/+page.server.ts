import type { PageServerLoad } from './$types';
import type { Playlist, Video, Flag, Note } from '$lib/types';

type pbPlaylistRecord = Playlist & {
  expand: {
    video_via_playlist: (Video & { expand: { flag_via_video: Flag[] } })[];
    note_via_playlist: Note[];
  };
};

export const load: PageServerLoad = async ({ locals }) => {
  const records = await locals.pb.collection('playlist').getFullList({
    sort: '-created',
    expand:
      'video_via_playlist.playlist, video_via_playlist.flag_via_video.video, note_via_playlist.playlist'
  });

  const playlists: Playlist[] = records.map((record: pbPlaylistRecord) => {
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
      videos: record.expand?.video_via_playlist
        ? record.expand?.video_via_playlist?.map((video) => {
          return {
            id: video.id,
            title: video.title,
            artist: video.artist,
            created: video.created,
            tags: video.tags,
            lastPlayed: video.lastPlayed,
            updated: video.updated,
            youtubeId: video.youtubeId,
            flags: video.expand?.flag_via_video
              ? video.expand?.flag_via_video?.map((flag) => {
                return {
                  id: flag.id,
                  name: flag.name,
                  time: flag.time,
                  seekCC: flag.seekCC,
                  seekSecondsBefore: flag.seekSecondsBefore,
                  sendCC: flag.sendCC,
                  sendCCValue: flag.sendCCValue,
                  sendPC: flag.sendPC,
                  created: flag.created,
                  updated: flag.updated
                };
              })
              : []
          };
        })
        : [],
      notes: record.expand?.note_via_playlist
        ? record.expand?.note_via_playlist?.map((note) => {
          return {
            id: note.id,
            message: note.message,
            title: note.title,
            created: note.created,
            updated: note.updated
          };
        })
        : []
    };
  });

  return {
    playlists: playlists
  };
};
