<script lang="ts">
	import type { PageProps } from './$types';
	import { layoutState, playlistState, youtubeState, timelineState } from '$lib';
	import { slide, fade } from 'svelte/transition';
	import { localStore } from '$lib';
	import { onMount } from 'svelte';

	import {
		CreatePlaylist,
		EditPlaylist,
		Nav,
		Notes,
		Library,
		VideoPlayer,
		Timeline,
		MidiAssign,
		GlobalMidi
	} from '$lib/components';

	const globalMIDI = localStore('globalMIDI', {
		left: -1,
		leftStep: 5,
		right: -1,
		rightStep: 5,
		startStop: -1,
		slow: -1,
		fast: -1,
		volumeUp: -1,
		volumeUpStep: 10,
		volumeDown: -1,
		volumeDownStep: 10,
		prevFlag: -1,
		nextFlag: -1,
		prevNextSecondsBefore: 3,
		addFlag: -1,
		restart: -1
	});

	let { data }: PageProps = $props();
	playlistState.playlists = data.playlists;

	let showPlaylists = $state(false);

	onMount(() => {
		let defaultSort = localStorage.getItem('sort');

		if (defaultSort == 'recent') {
			data.playlists.sort((a, b) => {
				let aVal = new Date(a.lastPlayed).getTime();
				let bVal = new Date(b.lastPlayed).getTime();
				if (aVal < bVal) {
					return 1;
				} else if (aVal > bVal) {
					return -1;
				} else {
					return 0;
				}
			});
		}

		showPlaylists = true;
		playlistState.playlists = data.playlists;
	});

	$effect(() => {
		if (youtubeState.youtubePlayer && playlistState.selectedVideo) {
			if (youtubeState.youtubePlayer.loadVideoById) {
				youtubeState.youtubePlayer.loadVideoById(playlistState.selectedVideo.youtubeId);
			}
			timelineState.timelineLength = 0;
			timelineState.currentTime = 0;
			playlistState.selectedFlag = undefined;
		}
	});
</script>

<svelte:head>
	<title>PWM - {playlistState.selectedPlaylist?.title}</title>
</svelte:head>

<div class="font-roboto flex h-screen max-h-screen min-w-fit flex-col bg-zinc-950 text-zinc-100">
	<Nav />

	<div class="body-container flex flex-1 flex-row px-4 pb-4 lg:px-28">
		{#if layoutState.showNotes}
			<div transition:slide={{ axis: 'x' }}>
				<div class="mr-4 flex h-full max-h-full" transition:fade>
					<Notes />
				</div>
			</div>
		{/if}

		<div class="flex flex-1 flex-col space-y-2">
			<div class="flex-1">
				<VideoPlayer bind:youtubePlayer={youtubeState.youtubePlayer} />
			</div>
			<Timeline {globalMIDI} />
		</div>

		{#if layoutState.showLibrary}
			<div transition:slide={{ axis: 'x' }}>
				<div class="ml-4 flex h-full max-h-full" transition:fade>
					<Library {showPlaylists} />
				</div>
			</div>
		{/if}
	</div>

	<!-- MODALS -->
	<CreatePlaylist />
	<EditPlaylist />
	<MidiAssign />
	<GlobalMidi {globalMIDI} />
</div>

<style>
	.body-container {
		max-height: calc(100% - 72px);
		box-sizing: border-box;
		overflow: hidden;
	}
</style>
