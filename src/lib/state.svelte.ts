import type { Playlist, Video, Genre, Instrument, Tuning, Tag, Flag } from '$lib';

interface FilterState {
  searchTerm: string;
  showFilters: boolean;
  tags: Tag[];
  genres: Genre[];
  instruments: Instrument[];
  tunings: Tuning[];
}

interface PlaylistState {
  selectedPlaylist: Playlist | undefined;
  selectedVideo: Video | undefined;
}

interface LayoutState {
  showNotes: boolean;
  showLibrary: boolean;
}

interface YoutubeState {
  youtubePlayer:
  | {
    seekTo: (time: number) => void;
    loadVideoById: (id: string) => void;
  }
  | undefined;
}

interface TimelineState {
  flags: Flag[];
  timelineLength: string;
  selectedFlag: Flag | undefined;
}

export const timelineState: TimelineState = $state({
  flags: [],
  timelineLength: '00:00:00',
  selectedFlag: undefined
});

export const youtubeState: YoutubeState = $state({
  youtubePlayer: undefined
});

export const filterState: FilterState = $state({
  searchTerm: '',
  showFilters: true,
  tags: [],
  genres: [],
  instruments: [],
  tunings: []
});

export const playlistState: PlaylistState = $state({
  selectedPlaylist: undefined,
  selectedVideo: undefined
});

export const layoutState: LayoutState = $state({
  showNotes: false,
  showLibrary: true
});
