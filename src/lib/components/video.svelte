<script>
	import { onMount } from 'svelte';

	export let player;
	export let initialVideoId = 'dQw4w9WgXcQ';

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
</script>

<!-- <svelte:head> -->
<!-- 	<script src="https://www.youtube.com/iframe_api"></script> -->
<!-- </svelte:head> -->

<div id={ytPlayerId} />

<style>
	#youtube-player {
		width: 70vw;
		height: 70vh;
	}
</style>
