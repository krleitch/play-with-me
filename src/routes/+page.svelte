<script lang="ts">
	import type { Playlist } from '$lib';
	import { layoutState, playlistState, youtubeState } from '$lib';
	import { slide, fade } from 'svelte/transition';

	// TODO: MOVE PAYLISTS TO THE STATE

	import {
		CreatePlaylist,
		Modal,
		Nav,
		Notes,
		Library,
		VideoPlayer,
		Timeline
	} from '$lib/components';

	let { data }: { data: { playlists: Playlist[] } } = $props();

	interface YoutubePlayer {
		seekTo: (time: number) => void;
		loadVideoById: (id: string) => void;
	}

	// let youtubePlayer: YoutubePlayer | undefined = $state();

	$effect(() => {
		if (youtubeState.youtubePlayer && playlistState.selectedVideo) {
			youtubeState.youtubePlayer.loadVideoById(playlistState.selectedVideo.youtubeId);
		}
	});
</script>

<div class="font-roboto flex h-screen flex-col bg-zinc-900 text-zinc-100">
	<Nav />

	<div class="flex flex-1 flex-row px-8 pb-8">
		{#if layoutState.showNotes}
			<div transition:slide={{ axis: 'x' }}>
				<div class="ml-4" transition:fade>
					<Notes />
				</div>
			</div>
		{/if}

		<div class="flex flex-1 flex-col space-y-2">
			<div class="flex-1">
				<VideoPlayer bind:youtubePlayer={youtubeState.youtubePlayer} />
			</div>
			<Timeline />
		</div>

		{#if layoutState.showLibrary}
			<div transition:slide={{ axis: 'x' }}>
				<div class="ml-4" transition:fade>
					<Library playlists={data.playlists} />
				</div>
			</div>
		{/if}
	</div>

	<Modal
		bind:showModal={layoutState.showCreatePlaylist}
		closeable={false}
		title={'Create Playlist'}
	>
		<CreatePlaylist />
	</Modal>
</div>
