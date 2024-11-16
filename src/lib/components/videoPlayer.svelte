<script lang="ts">
	import { onMount } from 'svelte';

	let player: any;
	let initialVideoId = '';

	const ytPlayerId = 'youtube-player';

	import type { Video } from '$lib/types';

	interface Props {
		selectedVideo: Video | undefined;
	}

	let { selectedVideo = $bindable() }: Props = $props();

	onMount(() => {
		function load() {
			player = new YT.Player(ytPlayerId, {
				height: '100%',
				width: '100%',
				videoId: initialVideoId,
				playerVars: { autoplay: 1 }
			});
		}

		if (window.YT) {
			load();
		} else {
			window.onYouTubeIframeAPIReady = load;
		}
	});

	const toggle = () => {
		console.log('changing video id');
		player.loadVideoById('dQw4w9WgXcQ');
	};

	$effect(() => {
		if (selectedVideo) {
			player.loadVideoById(selectedVideo?.youtubeId);
		}
	});
</script>

<svelte:head>
	<script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<div id={ytPlayerId}></div>

<button onclick={toggle}>change video</button>
