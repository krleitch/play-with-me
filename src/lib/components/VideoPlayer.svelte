<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { playlistState } from '$lib';

	let initialVideoId = '';
	const ytPlayerId = 'youtube-player';

	// pass the player to let the collection viewer control it
	let { youtubePlayer = $bindable() } = $props();

	onMount(() => {
		function load() {
			youtubePlayer = new YT.Player(ytPlayerId, {
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
</script>

<svelte:head>
	<script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<div class="rounded-xl" id={ytPlayerId}></div>
