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

	function onPlayerReady(event) {
		// get the last played playlist
		let playlist = undefined;
		playlistState.playlists.forEach((p) => {
			if (playlist) {
				let aVal = new Date(playlist.lastPlayed).getTime();
				let bVal = new Date(p.lastPlayed).getTime();
				if (aVal < bVal) {
					playlist = p;
				} else if (aVal > bVal) {
					// keep
				} else {
					// keep
				}
			} else {
				playlist = p;
			}
		});
		// ENABLE if you want to get the last created playlist
		// const playlist = playlistState.playlists.at(0);

		if (playlist) {
			playlistState.selectedPlaylist = playlist;
			playlistState.selectedVideo = playlist.videos?.length > 0 ? playlist.videos[0] : undefined;
			// ENABLE if you want it to update the lastPlayed of the playlist when it auto selects
			// const flagResponse = fetch('/api/playlist/lastPlayed', {
			// 	method: 'PATCH',
			// 	body: JSON.stringify({ playlistId: playlist.id })
			// });
			// playlist.lastPlayed = new Date().toISOString();
		}
		// youtubeState.youtubePlayer.pauseVideo();
		// youtubeState.youtubePlayer.options.playerVars.autoplay = 1;
	}

	// pass the player to let the collection viewer control it
	let { youtubePlayer = $bindable() } = $props();

	onMount(() => {
		function load() {
			youtubePlayer = new YT.Player(ytPlayerId, {
				height: '100%',
				width: '100%',
				// videoId: initialVideoId,
				playerVars: { autoplay: 0 },
				events: {
					onStateChange: onPlayerStateChange,
					onReady: onPlayerReady
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

<style lang="postcss">
	#youtube-player {
		outline: none;
	}
	#youtube-player:focus-visible {
		outline: none;
	}
</style>
