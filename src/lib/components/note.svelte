<script lang="ts">
	import type { Video } from '$lib/types';

	interface Props {
		selectedVideo: Video | undefined;
	}
	let { selectedVideo = $bindable() }: Props = $props();

	let noteText = $state('');
</script>

<div class="flex flex-1 flex-col bg-zinc-900">
	<div class="flex flex-row items-center space-x-1 pb-1 pt-2 text-zinc-300">
		<span class="material-symbols-outlined !text-md">description</span>
		<span> Notes </span>
	</div>
	<div class="mb-1 border-t-2 border-zinc-800"></div>

	<div class="flex h-full flex-col pb-2">
		<div class="flex-1">
			{#if selectedVideo !== undefined && selectedVideo.notes}
				{#each selectedVideo.notes as note}
					{note.text}
				{/each}
			{/if}
		</div>
		<div class="flex flex-row justify-end space-x-2">
			<input
				class="flex-1"
				bind:value={noteText}
				type="text"
				placeholder="Note..."
				id="noteInput"
			/>
			<button
				class="flex flex-row items-center rounded-lg bg-blue-950 px-2 py-1 text-white hover:bg-blue-900"
			>
				Add Note
			</button>
		</div>
	</div>
</div>

<style lang="postcss">
	input {
		outline: none;
		border: none;
		@apply bg-zinc-950;
		@apply rounded-lg;
	}
	input:focus {
		box-shadow: none;
		outline: none;
		border: none;
	}
	input::placeholder {
		opacity: 0.5;
		@apply text-zinc-300;
	}
</style>
