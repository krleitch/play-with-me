import { Genre, Instrument, Tag, Tuning } from '$lib';

type Note = {
	id: string;
	title: string;
	message: string; // RICH TEXT
	created: string;
	updated: string;
};

type Video = {
	id: string;
	title: string;
	artist: string;
	created: string;
	tags: Tag[];
	updated: string;
	lastPlayed: string;
	youtubeId: string;
	flags: Flag[];
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
	notes: Note[];
	views: number;
	created: string;
	updated: string;
	favourite: boolean;
};

type Flag = {
	id: string;
	name: string;
	time: number; // seconds since start
	seekCC: number;
	seekSecondsBefore: number;
	sendCC: number;
	sendCCValue: number;
	sendPC: number;
	created: string;
	updated: string;
};

export type { Video, Playlist, Flag, Note };
