export type Timestamp = {
  id: string;
  title: string;
  time: string;
  created: string;
  updated: string;
};

export type Video = {
  id: string;
  title: string;
  created: string;
  updated: string;
  youtubeId: Video[];
  timestamps: Timestamp[];
};

export enum Genre {
  Rock = 'rock',
  Metal = 'metal',
  Blues = 'blues',
  Jazz = 'jazz',
  Folk = 'folk'
}

export enum Instrument {
  Acoustic = 'acoustic',
  Electric = 'electric'
}

export enum Tag {
  Tutorial = 'tutorial',
  Cover = 'cover',
  Theory = 'Theory',
  BackingTrack = 'backing-track'
}

export enum Tuning {
  Standard = 'standard',
  HalfStepDown = 'half-step-down'
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
