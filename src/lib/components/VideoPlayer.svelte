<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { playlistState } from '$lib';

	let initialVideoId = '';
	const ytPlayerId = 'youtube-player';

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

	$effect(() => {
		let player = document.getElementById(ytPlayerId);
		console.log(playlistState.selectedVideo);
		if (playlistState.selectedVideo && player) {
			player.loadVideoById(playlistState.selectedVideo.youtubeId);
		}
	});
</script>

<svelte:head>
	<script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<div id={ytPlayerId}></div>
