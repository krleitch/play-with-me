<script lang="ts">
	import type { Playlist, Genre, Instrument, Tag, Tuning } from '$lib';

	import { Filter } from '$lib/components';

	interface Props {
		playlists: Playlist[];
	}

	let { playlists }: Props = $props();
</script>

<div class="w-96">
	<Filter />

	<div>
		{#each playlists as playlist}
			<button class="w-100">
				<div class="flex flex-col space-x-1">
					<span>
						{playlist.title}
					</span>
					<span class="text-xs text-zinc-300">{playlist.artist}</span>
				</div>
			</button>
		{/each}
	</div>
</div>

<style lang="postcss">
	@reference "../../app.css";

	button {
		@apply cursor-pointer;
	}
</style>
