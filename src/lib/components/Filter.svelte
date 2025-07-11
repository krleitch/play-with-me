<script lang="ts">
	import type { Playlist } from '$lib';
	import { Genre, Instrument, Tag, Tuning } from '$lib';
	import { FilterProperty } from '$lib/components';
	import { slide, fade } from 'svelte/transition';
	import { filterState } from '$lib';

	let resetFilters = () => {
		filterState.tags = [];
		filterState.genres = [];
		filterState.tunings = [];
		filterState.genres = [];
	};
</script>

{#if filterState.showFilters}
	<div transition:slide>
		<div class="mb-4 rounded-xl bg-zinc-950 p-2" transition:fade>
			<FilterProperty
				bind:list={filterState.tags}
				title={'Tags'}
				icon={'sell'}
				color={'blue'}
				values={Object.values(Tag)}
			/>
			<FilterProperty
				bind:list={filterState.genres}
				title={'Genres'}
				icon={'music_note'}
				color={'red'}
				values={Object.values(Genre)}
			/>
			<FilterProperty
				bind:list={filterState.instruments}
				title={'Instruments'}
				icon={'piano'}
				color={'amber'}
				values={Object.values(Instrument)}
			/>
			<FilterProperty
				bind:list={filterState.tunings}
				title={'Tunings'}
				icon={'graphic_eq'}
				color={'purple'}
				values={Object.values(Tuning)}
			/>
		</div>
	</div>
{/if}
