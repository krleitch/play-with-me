<script lang="ts">
	import type { Collection, Video } from '$lib/types';

	import Timestamp from '$lib/components/timestamp.svelte';
	import VideoPlayer from '$lib/components/videoPlayer.svelte';

	interface Props {
		selectedCollection: Collection | undefined;
	}

	let { selectedCollection = $bindable() }: Props = $props();

	let selectedVideo: Video | undefined = $state();
</script>

<div class="flex flex-1 flex-col pr-2">
	<!-- Video player -->
	<VideoPlayer bind:selectedVideo />
	<div class="flex h-80 flex-row bg-slate-950 p-2 text-white">
		<Timestamp />

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
