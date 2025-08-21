<script lang="ts">
	import { playlistState } from '$lib';
	import type { Video } from '$lib/types';

	interface VideoItem {
		video: Video;
	}
	let { video = $bindable() }: VideoItem = $props();
</script>

<button
	class={playlistState.selectedVideo?.id == video.id ? 'bg-zinc-900' : ''}
	onclick={() => {
		playlistState.selectedVideo = video;
		const lastPlayedResponse = fetch('/api/video/lastPlayed', {
			method: 'PATCH',
			body: JSON.stringify({ videoId: video.id })
		});
		video.lastPlayed = new Date().toISOString();
	}}
>
	<div class="flex h-[65px] flex-row space-x-2">
		<img
			class="rounded-md"
			src={'http://img.youtube.com/vi/' + video.youtubeId + '/mqdefault.jpg'}
			alt=""
		/>
		<div class="flex w-full flex-col items-start justify-start">
			<span class="text-left">{video.title} </span>
			<span class="text-xs font-light text-zinc-300">{video.artist}</span>
		</div>
	</div>
</button>

<style lang="postcss">
	@reference "../../app.css";

	button {
		@apply w-full cursor-pointer p-1;
	}

	button:hover {
		@apply bg-zinc-900;
	}
</style>
