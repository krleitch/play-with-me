import type { Playlist, Video, Genre, Instrument, Tuning, Tag, Flag } from '$lib';

interface FilterState {
  searchTerm: string;
  showFilters: boolean;
  showFavourites: boolean;
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
  selectedFlag: Flag | undefined;
}

interface LayoutState {
  showNotes: boolean;
  showLibrary: boolean;
  showCreatePlaylist: boolean;
  showEditPlaylist: boolean;
  showMidiAssign: boolean;
  showGlobalMidi: boolean;
  showCountdown: boolean;
  showAddFlag: boolean;
}

interface YoutubeState {
  youtubePlayer:
  | {
    seekTo: (time: number) => void;
    loadVideoById: (id: string) => void;
    getDuration: () => number;
    getCurrentTime: () => number;
    getPlayerState: () => number;
    pauseVideo: () => void;
    playVideo: () => void;
    setVolume: (volume: number) => void;
    getVolume: () => number;
    setPlaybackRate: (rate: number) => void;
    getPlaybackRate: () => number;
  }
  | undefined;
}

interface TimelineState {
  flags: Flag[];
  timelineLength: number;
  currentTime: number;
  prevCurrentTime: number;
  selectedFlag: Flag | undefined;
}

interface MidiState {
  selectedMIDIInput: MIDIInput | undefined;
  selectedMIDIOutput: MIDIOutput | undefined;
  lastCCMessage: number | undefined;
  lastCCMessageValue: number | undefined;
  disableMIDI: boolean;
}

export const MIDIState: MidiState = $state({
  selectedMIDIInput: undefined,
  selectedMIDIOutput: undefined,
  lastCCMessage: undefined,
  lastCCMessageValue: undefined,
  disableMIDI: false
});

export const timelineState: TimelineState = $state({
  flags: [],
  timelineLength: 0,
  currentTime: 0,
  prevCurrentTime: 0,
  selectedFlag: undefined
});

export const youtubeState: YoutubeState = $state({
  youtubePlayer: undefined
});

export const filterState: FilterState = $state({
  searchTerm: '',
  showFavourites: false,
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
  editPlaylist: undefined,
  selectedFlag: undefined
});

export const layoutState: LayoutState = $state({
  showNotes: false,
  showLibrary: true,
  showCreatePlaylist: false,
  showEditPlaylist: false,
  showMidiAssign: false,
  showGlobalMidi: false,
  showCountdown: false,
  showAddFlag: false
});
