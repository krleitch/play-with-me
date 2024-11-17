<script lang="ts">
	import type { Collection, Video } from '$lib/types';

	import CollectionsList from '$lib/components/collectionsList.svelte';
	import CollectionViewer from '$lib/components/collectionViewer.svelte';

	let { data }: { data: { collections: Collection[] } } = $props();
	let selectedCollection: Collection | undefined = $state();
</script>

<div class="flex h-screen flex-row bg-gray-800 p-2 font-roboto">
	<CollectionViewer bind:selectedCollection />
	<CollectionsList bind:selectedCollection collections={data.collections} />
</div>
