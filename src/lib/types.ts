enum Genre {
  Rock = 'rock',
  Metal = 'metal',
  Pop = 'pop',
  Blues = 'blues',
  Jazz = 'jazz',
  Classical = 'classical'
}

enum Instrument {
  Electric = 'electric',
  Acoustic = 'acoustic',
  Slide = 'slide'
}

enum Tag {
  BackingTrack = 'backing-track',
  Tutorial = 'tutorial',
  Cover = 'cover',
  Theory = 'theory'
}

enum Tuning {
  Standard = 'standard',
  HalfStepDown = 'half-step-down',
  Drop = 'drop',
  Open = 'open',
  Alt = 'alt'
}

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
  tags: Tag[];
  videos: Video[];
  created: string;
  updated: string;
};

export type { Genre, Instrument, Tag, Tuning, Video, Playlist };
