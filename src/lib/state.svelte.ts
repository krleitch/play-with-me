import type { Playlist, Video, Genre, Instrument, Tuning, Tag } from '$lib';

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

export const filterState: FilterState = $state({
  searchTerm: '',
  showFilters: false,
  tags: [],
  genres: [],
  instruments: [],
  tunings: []
});

export const playlistState: PlaylistState = $state({
  selectedPlaylist: undefined,
  selectedVideo: undefined
});
