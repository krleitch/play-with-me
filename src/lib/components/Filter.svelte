<script lang="ts">
	import type { Playlist, Genre, Instrument, Tag, Tuning } from '$lib';
	import { filterState } from '$lib';
</script>

<div>
	{#if filterState.showFilters}
		FILTER
	{:else}
		HIDE FILTER
	{/if}
</div>
