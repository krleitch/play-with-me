<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { Genre, Instrument, Tag, Tuning } from '$lib';
	import { filterState } from '$lib';
	import { FilterProperty } from '$lib/components';
</script>

{#if filterState.showFilters}
	<div transition:slide>
		<div class="rounded-xl" transition:fade>
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
