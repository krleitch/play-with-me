<script lang="ts">
	import type { Collection, Video } from '$lib/types';

	import Timestamp from '$lib/components/timestamp.svelte';
	import VideoPlayer from '$lib/components/videoPlayer.svelte';

	interface Props {
		selectedCollection: Collection | undefined;
	}
	interface YoutubePlayer {
		seekTo: (time: number) => void;
		loadVideoById: (id: string) => void;
	}

	let { selectedCollection = $bindable() }: Props = $props();

	let selectedVideo: Video | undefined = $state();
	let player: YoutubePlayer | undefined = $state();

	const seekTo = (time: string) => {
		if (player) {
			const [minutes, seconds] = time.split(':');
			const totalSeconds = +minutes * 60 + +seconds;
			player.seekTo(totalSeconds);
		}
	};

	$effect(() => {
		if (selectedVideo && player) {
			player.loadVideoById(selectedVideo.youtubeId);
		}
	});
</script>

<div class="flex flex-1 flex-col pr-2">
	<!-- Video player -->
	<VideoPlayer bind:player />
	<div class="flex h-80 flex-row bg-slate-950 p-2 text-white">
		<!-- Timestamps -->
		<div class="bg-slate-700">
			Timestamps:
			{#if selectedVideo !== undefined && selectedVideo.timestamps.length > 0}
				{#each selectedVideo.timestamps as timestamp}
					<button
						onclick={() => {
							seekTo(timestamp.time);
						}}
					>
						{timestamp.title}
						-
						{timestamp.time}
					</button>
				{/each}
			{/if}
		</div>

		<div class="flex flex-1 flex-col">
			{#if selectedCollection}
				{#each selectedCollection.videos as video}
					<button
						class={selectedVideo?.id == video.id
							? 'p1 flex w-full flex-row bg-slate-800'
							: 'p1 flex w-full flex-row'}
						onclick={() => {
							selectedVideo = video;
						}}
					>
						<!-- Show first video thumbnail -->
						<img
							class="w-32"
							src={'http://img.youtube.com/vi/' + video.youtubeId + '/mqdefault.jpg'}
							alt=""
						/>

						<!-- Show video info -->
						<div class="flex flex-1 flex-col pl-2">
							<!-- Title -->
							<div class="flex flex-row items-center justify-between">
								<span>{video.title}</span>
							</div>
						</div>
					</button>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	button:hover {
		@apply bg-slate-800;
	}
</style>
