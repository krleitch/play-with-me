<script lang="ts">
	import type { Collection } from '$lib/types';
	import CollectionsSearch from '$lib/components/collectionsSearch.svelte';
	import { Genre, Instrument, Tag, Tuning } from '$lib/types';

	interface Props {
		selectedCollection: Collection | undefined;
		collections: Collection[];
	}

	let { selectedCollection = $bindable(), collections }: Props = $props();
	let searchTerm = $state('');
	let filters = $state({
		tags: [],
		genres: [],
		instruments: [],
		tunings: []
	});

	let filterdCollections = $derived(
		collections.filter((x) => {
			let titles = x.title.includes(searchTerm);
			let tags = filters.tags.every((tag) => x.tags.includes(tag));
			let genres = filters.genres.every((genre) => x.genres.includes(genre));
			let instruments = filters.instruments.every((instrument) =>
				x.instruments.includes(instrument)
			);
			let tunings = filters.tunings.every((tuning) => x.tunings.includes(tuning));
			return titles && tags && genres && instruments && tunings;
		})
	);
</script>

<div class="flex w-96 flex-col bg-gray-950 p-2 text-slate-50">
	<!-- Search and filter -->
	<CollectionsSearch bind:searchTerm bind:filters />

	{#each filterdCollections as collection}
		<button
			class={selectedCollection?.id == collection.id
				? 'p1 flex w-full flex-row bg-slate-800'
				: 'p1 flex w-full flex-row'}
			onclick={() => {
				selectedCollection = collection;
			}}
		>
			<!-- Show first video thumbnail -->
			{#if collection.videos}
				<img
					class="w-32"
					src={'http://img.youtube.com/vi/' + collection.videos[0].youtubeId + '/mqdefault.jpg'}
					alt=""
				/>
			{/if}

			<!-- Show video info -->
			<div class="flex flex-1 flex-col pl-2">
				<!-- Title and # of videos -->
				<div class="flex flex-row items-center justify-between">
					<span>{collection.title}</span>
					{#if collection.videos}
						<span class="h-4 w-4 rounded-full bg-sky-800 text-center text-xs"
							>{collection.videos.length}</span
						>
					{/if}
				</div>

				<!-- Artist -->
				<span class="text-left text-sm font-thin">{collection.artist}</span>

				<!-- Tags -->
				<div class="flex flex-row space-x-2">
					{#each collection.tags as tag}
						<div class="rounded-lg bg-sky-800 px-2 text-sm">
							{tag}
						</div>
					{/each}
				</div>
			</div>
		</button>
	{/each}
</div>

<style lang="postcss">
	button:hover {
		@apply bg-slate-800;
	}
</style>
