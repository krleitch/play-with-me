<script lang="ts">
	import { fade } from 'svelte/transition';
	//@ts-ignore
	// svelte ls issue only
	import { clickOutside } from '$lib/clickOutside';
	import { Genre, Instrument, Tag, Tuning } from '$lib/types';
	import FilterProperty from '$lib/components/filterProperty.svelte';

	interface Props {
		searchTerm: string;
		filters: { tags: Tag[]; genres: Genre[]; instruments: Instrument[]; tunings: Tuning[] };
	}
	let { searchTerm = $bindable(), filters = $bindable() }: Props = $props();

	let showFilters = $state(false);

	let resetFilters = () => {
		filters = {
			tags: [],
			genres: [],
			instruments: [],
			tunings: []
		};
	};
</script>

<div class="relative">
	<!-- Input -->
	<div class="m-2 flex flex-row items-center rounded-md bg-zinc-950 text-white">
		<span class="material-symbols-outlined !text-md ml-2 text-zinc-300">search</span>
		<input
			class="flex-1"
			bind:value={searchTerm}
			type="text"
			placeholder="Search..."
			id="searchInput"
		/>
		<div class="mr-2 flex flex-row items-center">
			<button
				class="flex items-center"
				onclick={() => (showFilters = !showFilters)}
				aria-label="Filter"
			>
				<span class="material-symbols-outlined !text-md text-zinc-300">tune</span>
			</button>
			<button class="flex items-center" onclick={() => (searchTerm = '')} aria-label="X">
				<span class="material-symbols-outlined !text-md text-zinc-300">close</span>
			</button>
		</div>
	</div>

	<!-- Filter options-->
	{#if showFilters}
		<div
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 100 }}
			use:clickOutside
			onoutclick={() => (showFilters = false)}
			class="absolute left-0 top-14 flex w-full flex-col space-y-1 rounded-md bg-zinc-950 p-2 text-white"
		>
			<FilterProperty
				bind:list={filters.tags}
				title={'Tags'}
				icon={'sell'}
				color={'blue'}
				values={Object.values(Tag)}
			/>
			<FilterProperty
				bind:list={filters.genres}
				title={'Genres'}
				icon={'music_note'}
				color={'red'}
				values={Object.values(Genre)}
			/>
			<FilterProperty
				bind:list={filters.instruments}
				title={'Instruments'}
				icon={'piano'}
				color={'amber'}
				values={Object.values(Instrument)}
			/>
			<FilterProperty
				bind:list={filters.tunings}
				title={'Tunings'}
				icon={'graphic_eq'}
				color={'purple'}
				values={Object.values(Tuning)}
			/>

			<!-- Buttons -->
			<div class="flex flex-row justify-end space-x-2">
				<button
					onclick={() => resetFilters()}
					class="flex flex-row items-center rounded-lg bg-red-950 px-2 py-1 text-white hover:bg-red-900"
				>
					Reset All
					<span class="material-symbols-outlined !text-md ml-1"> delete </span>
				</button>
				<button
					onclick={() => (showFilters = false)}
					class="flex flex-row items-center rounded-lg bg-blue-950 px-2 py-1 text-white hover:bg-blue-900"
				>
					Apply Filters
					<span class="material-symbols-outlined !text-md ml-1"> filter_list </span>
				</button>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	input {
		outline: none;
		border: none;
		@apply bg-zinc-950;
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
