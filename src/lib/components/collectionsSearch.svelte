<script lang="ts">
	import { fade } from 'svelte/transition';
	import { Genre, Instrument, Tag, Tuning } from '$lib/types';
	import FilterProperty from '$lib/components/filterProperty.svelte';

	interface Props {
		searchTerm: string;
		filters: { tags: Tag[]; genres: Genre[]; instruments: Instrument[]; tunings: Tuning[] };
	}
	let { searchTerm = $bindable(), filters = $bindable() }: Props = $props();

	let showFilters = $state(true);
</script>

<div class="relative">
	<!-- Input -->
	<div class="m-2 flex flex-row items-center rounded-md bg-gray-900 text-white">
		<ion-icon class="ml-2 text-2xl text-slate-500" name="search"></ion-icon>
		<input
			class="flex-1"
			bind:value={searchTerm}
			type="text"
			placeholder="Search..."
			id="searchInput"
		/>
		<div class="mr-2 flex flex-row items-center space-x-1">
			<button
				class="flex items-center"
				onclick={() => (showFilters = !showFilters)}
				aria-label="Filter"
			>
				<ion-icon class="text-2xl text-slate-500" name="options"></ion-icon>
			</button>
			<button class="flex items-center" onclick={() => (searchTerm = '')} aria-label="X">
				<ion-icon class="text-2xl text-red-800" name="close"></ion-icon>
			</button>
		</div>
	</div>

	<!-- Filter options-->
	{#if showFilters}
		<div
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 100 }}
			class="absolute left-0 top-14 flex w-full flex-col space-y-1 rounded-md bg-gray-900 p-2 text-white"
		>
			<FilterProperty
				bind:list={filters.tags}
				title={'Tags'}
				icon={'pricetag'}
				color={'red'}
				values={Object.values(Tag)}
			/>
			<FilterProperty
				bind:list={filters.genres}
				title={'Genre'}
				icon={'musical-notes'}
				color={'blue'}
				values={Object.values(Genre)}
			/>
			<FilterProperty
				bind:list={filters.instruments}
				title={'Instruments'}
				icon={'microphone'}
				color={'amber'}
				values={Object.values(Instrument)}
			/>
			<FilterProperty
				bind:list={filters.tunings}
				title={'Tunings'}
				icon={'pulse'}
				color={'purple'}
				values={Object.values(Tuning)}
			/>
		</div>
	{/if}
</div>

<style lang="postcss">
	input {
		outline: none;
		border: none;
		@apply bg-gray-900;
	}
	input:focus {
		box-shadow: none;
		outline: none;
		border: none;
	}
	input::placeholder {
		opacity: 0.5;
	}
</style>
