<script lang="ts">
	import type { Collection, Video } from '$lib/types';

	import VideoPlayer from '$lib/components/videoPlayer.svelte';
	import Timestamp from '$lib/components/timestamp.svelte';
	import Note from '$lib/components/note.svelte';

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

	<!-- Bottom Info -->
	<div class="mt-2 flex h-80 flex-row text-white">
		<!-- Time and Notes -->
		<div class="mr-2 flex flex-1 flex-row space-x-2 bg-gray-800">
			<Timestamp bind:selectedVideo {seekTo} />
			<Note bind:selectedVideo />
		</div>

		<!-- Video list -->
		<div class="flex w-96 flex-col bg-gray-950">
			<div class="flex min-h-9 flex-row items-center space-x-1 bg-gray-900 px-2 pb-1 pt-2">
				{#if selectedCollection}
					<span> {selectedCollection.title} - {selectedCollection.artist} </span>
				{/if}
			</div>
			<div class="border-t-2 border-gray-700"></div>
			{#if selectedCollection}
				<div class="p-2">
					{#each selectedCollection.videos as video}
						<button
							class={selectedVideo?.id == video.id
								? 'flex w-full flex-row bg-gray-900 px-1 py-1'
								: 'flex w-full flex-row px-1 py-1'}
							onclick={() => {
								selectedVideo = video;
							}}
						>
							<!-- Thumbnail -->
							<img
								class="w-32 rounded-lg"
								src={'http://img.youtube.com/vi/' + video.youtubeId + '/mqdefault.jpg'}
								alt=""
							/>

							<!-- Info -->
							<div class="flex flex-1 flex-col pl-2">
								<div class="flex flex-col text-left">
									<!-- title -->
									<div>{video.title}</div>
									<!-- Artist -->
									<div class="text-sm font-thin">{video.artist}</div>
									<!-- Tag -->
									<div class="mt-1 flex flex-row">
										<div class="rounded-lg bg-blue-800 px-2 text-sm">
											{video.tag}
										</div>
									</div>
								</div>
							</div>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	button:hover {
		@apply bg-gray-900;
	}
</style>
