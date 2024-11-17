<script lang="ts">
	import type { Video } from '$lib/types';

	interface Props {
		selectedVideo: Video | undefined;
		seekTo: (time: string) => void;
	}
	let { selectedVideo = $bindable(), seekTo }: Props = $props();
</script>

<div class="flex w-56 flex-col bg-gray-950">
	<div class="flex flex-row items-center space-x-1 bg-gray-900 px-2 pb-1 pt-2">
		<span class="material-symbols-outlined !text-md">schedule</span>
		<span> Timestamps </span>
	</div>
	<div class="mb-1 border-t-2 border-gray-700"></div>
	<div class="px-2 pb-2">
		{#if selectedVideo !== undefined && selectedVideo.timestamps}
			{#each selectedVideo.timestamps as timestamp}
				<button
					class="group/time flex flex-row items-center"
					onclick={() => {
						seekTo(timestamp.time);
					}}
				>
					{timestamp.title}
					&nbsp-&nbsp
					<span class="text-blue-500 group-hover/time:text-blue-400">
						{timestamp.time}
					</span>
				</button>
			{/each}
		{/if}
	</div>
</div>
