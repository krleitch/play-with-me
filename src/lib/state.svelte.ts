import type { Playlist, Video, Genre, Instrument, Tuning, Tag, Flag } from '$lib';

interface FilterState {
  searchTerm: string;
  showFilters: boolean;
  sortType: 'created' | 'updated';
  tags: Tag[];
  genres: Genre[];
  instruments: Instrument[];
  tunings: Tuning[];
}

interface PlaylistState {
  playlists: Playlist[];
  selectedPlaylist: Playlist | undefined;
  editPlaylist: Playlist | undefined;
  selectedVideo: Video | undefined;
}

interface LayoutState {
  showNotes: boolean;
  showLibrary: boolean;
  showCreatePlaylist: boolean;
  showEditPlaylist: boolean;
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
  sortType: 'created',
  showFilters: true,
  tags: [],
  genres: [],
  instruments: [],
  tunings: []
});

export const playlistState: PlaylistState = $state({
  playlists: [],
  selectedPlaylist: undefined,
  selectedVideo: undefined,
  editPlaylist: undefined
});

export const layoutState: LayoutState = $state({
  showNotes: false,
  showLibrary: true,
  showCreatePlaylist: false,
  showEditPlaylist: false
});
