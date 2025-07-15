<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { playlistState, timelineState, youtubeState } from '$lib';

	let initialVideoId = '';
	const ytPlayerId = 'youtube-player';

	let stopwatch;

	function onPlayerStateChange(event) {
		if (event.data == YT.PlayerState.PLAYING) {
			timelineState.timelineLength = youtubeState.youtubePlayer.getDuration();

			stopwatch = setInterval(() => {
				timelineState.prevCurrentTime = timelineState.currentTime;
				timelineState.currentTime = youtubeState.youtubePlayer.getCurrentTime();
			}, 100);
		} else if (event.data == YT.PlayerState.PAUSED) {
			window.clearInterval(stopwatch);
			timelineState.currentTime = youtubeState.youtubePlayer.getCurrentTime();
			timelineState.prevCurrentTime = youtubeState.youtubePlayer.getCurrentTime();
		} else if (event.data == YT.PlayerState.ENDED) {
			window.clearInterval(stopwatch);
			timelineState.currentTime = youtubeState.youtubePlayer.getCurrentTime();
			timelineState.prevCurrentTime = youtubeState.youtubePlayer.getCurrentTime();
		} else if (event.data == YT.PlayerState.UNSTARTED) {
			timelineState.currentTime = youtubeState.youtubePlayer.getCurrentTime();
			timelineState.prevCurrentTime = youtubeState.youtubePlayer.getCurrentTime();
		}
	}

	// pass the player to let the collection viewer control it
	let { youtubePlayer = $bindable() } = $props();

	onMount(() => {
		function load() {
			youtubePlayer = new YT.Player(ytPlayerId, {
				height: '100%',
				width: '100%',
				videoId: initialVideoId,
				playerVars: { autoplay: 1 },
				events: {
					onStateChange: onPlayerStateChange
				}
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
