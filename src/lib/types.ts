import { Genre, Instrument, Tag, Tuning } from '$lib';

type Video = {
  id: string;
  title: string;
  artist: string;
  created: string;
  tag: Tag;
  updated: string;
  youtubeId: string;
};

type Playlist = {
  id: string;
  title: string;
  artist: string;
  lastPlayed: string;
  tunings: Tuning[];
  genres: Genre[];
  instruments: Instrument[];
  videos: Video[];
  created: string;
  updated: string;
};

type Flag = {
  id: string;
  name: string;
  time: string;
  seekMidi: string;
  sendMidi: string;
  created: string;
  updated: string;
};

export type { Video, Playlist, Flag };
