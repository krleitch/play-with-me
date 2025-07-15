<script lang="ts">
	import type { PageProps } from './$types';
	import { json } from '@sveltejs/kit';
	import type { Video } from '$lib/types';
	import { layoutState, playlistState, youtubeState } from '$lib';
	import { slide, fade } from 'svelte/transition';

	import {
		CreatePlaylist,
		EditPlaylist,
		Nav,
		Notes,
		Library,
		VideoPlayer,
		Timeline
	} from '$lib/components';

	let { data }: PageProps = $props();

	playlistState.playlists = data.playlists;

	$effect(() => {
		if (youtubeState.youtubePlayer && playlistState.selectedVideo) {
			youtubeState.youtubePlayer.loadVideoById(playlistState.selectedVideo.youtubeId);
		}
	});
</script>

<div class="font-roboto flex h-screen max-h-screen min-w-fit flex-col bg-zinc-950 text-zinc-100">
	<Nav />

	<div class="body-container flex flex-1 flex-row px-28 pb-4">
		{#if layoutState.showNotes}
			<div transition:slide={{ axis: 'x' }}>
				<div class="mr-4" transition:fade>
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
				<div class="ml-4 flex h-full max-h-full" transition:fade>
					<Library />
				</div>
			</div>
		{/if}
	</div>

	<!-- MODALS -->
	<CreatePlaylist />
	<EditPlaylist />
</div>

<style>
	.body-container {
		max-height: calc(100% - 72px);
		box-sizing: border-box;
		overflow: hidden;
	}
</style>
