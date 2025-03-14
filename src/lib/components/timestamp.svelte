<script lang="ts">
	import type { Video } from '$lib/types';

	interface Props {
		selectedVideo: Video | undefined;
		seekTo: (time: string) => void;
	}
	let { selectedVideo = $bindable(), seekTo }: Props = $props();

	let titleText = $state('');
	let timeText = $state('');
</script>

<div class="flex flex-col bg-zinc-900">
	<div class="flex flex-row items-center space-x-1 bg-zinc-900 pb-1 pt-2 text-zinc-300">
		<span class="material-symbols-outlined !text-md">schedule</span>
		<span> Timestamps </span>
	</div>
	<div class="mb-1 border-t-2 border-zinc-800"></div>
	<div class="flex h-full flex-col pb-2">
		<div class="flex-1">
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
		<div class="flex flex-row justify-end space-x-2">
			<input
				class="flex-1"
				bind:value={titleText}
				type="text"
				placeholder="Title..."
				id="noteInput"
			/>
			<input class="w-24" bind:value={timeText} type="text" placeholder="hh:mm:ss" id="noteInput" />
			<button
				class="flex flex-row items-center rounded-lg bg-blue-950 px-2 py-1 text-white hover:bg-blue-900"
			>
				Add Time
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
