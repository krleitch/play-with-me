<script lang="ts">
	import type { Video } from '$lib/types';

	interface Props {
		selectedVideo: Video | undefined;
	}
	let { selectedVideo = $bindable() }: Props = $props();
</script>

<div class="flex flex-1 flex-col bg-gray-950">
	<div class="flex flex-row items-center space-x-1 bg-gray-900 px-2 pb-1 pt-2">
		<span class="material-symbols-outlined !text-md">description</span>
		<span> Notes </span>
	</div>
	<div class="mb-1 border-t-2 border-gray-700"></div>

	<div class="px-2 pb-2">
		{#if selectedVideo !== undefined && selectedVideo.notes}
			{#each selectedVideo.notes as note}
				{note.text}
			{/each}
		{/if}
	</div>
</div>
