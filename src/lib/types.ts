export type Timestamp = {
  id: string;
  title: string;
  time: string;
  created: string;
  updated: string;
};

export type Note = {
  id: string;
  text: string;
  created: string;
  updated: string;
};

export type Video = {
  id: string;
  title: string;
  artist: string;
  created: string;
  tag: Tag;
  updated: string;
  youtubeId: string;
  timestamps: Timestamp[];
  notes: Note[];
};

export enum Genre {
  Rock = 'rock',
  Metal = 'metal',
  Pop = 'pop',
  Blues = 'blues',
  Jazz = 'jazz',
  Classical = 'classical'
}

export enum Instrument {
  Electric = 'electric',
  Acoustic = 'acoustic',
  Slide = 'slide'
}

export enum Tag {
  BackingTrack = 'backing-track',
  Tutorial = 'tutorial',
  Cover = 'cover',
  Theory = 'theory',
}

export enum Tuning {
  Standard = 'standard',
  HalfStepDown = 'half-step-down',
  Drop = 'drop',
  Open = 'open',
  Alt = 'alt'
}

export type Collection = {
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
