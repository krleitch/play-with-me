<script lang="ts">
	import type { Playlist, Genre, Instrument, Tag, Tuning } from '$lib';
	import { filterState, layoutState } from '$lib';

	function resetFilters() {
		filterState.tags = [];
		filterState.genres = [];
		filterState.tunings = [];
		filterState.instruments = [];
		filterState.searchTerm = '';
	}
</script>

<div class="flex flex-row items-center justify-between px-8 py-4">
	<!-- LEFT -->
	<div class="flex flex-row space-x-4">
		<!-- Add Playlist -->
		<button
			class="bg-blue-800 hover:bg-blue-900"
			onclick={() => (layoutState.showCreatePlaylist = true)}
			aria-label="Add Playlist"
		>
			<span class="material-symbols-outlined !text-md">add_circle</span>
			<span> Add Playlist </span>
		</button>

		<!-- Toggle Library -->
		<button
			class="bg-blue-800 hover:bg-blue-900"
			onclick={() => (layoutState.showLibrary = !layoutState.showLibrary)}
			aria-label="Library"
		>
			<span class="material-symbols-outlined !text-md">newsstand</span>
			<span> Library </span>
		</button>

		<!-- Toggle Notes -->
		<button
			class="bg-blue-800 hover:bg-blue-900"
			onclick={() => (layoutState.showNotes = !layoutState.showNotes)}
			aria-label="Notes"
		>
			<span class="material-symbols-outlined !text-md">edit</span>
			<span> Notes </span>
		</button>
	</div>

	<!-- RIGHT -->
	<div class="flex flex-row items-center space-x-4">
		<!-- Input -->
		<div class="flex flex-row items-center rounded-xl bg-zinc-950 text-white">
			<span class="material-symbols-outlined !text-md ml-2 text-zinc-300">search</span>
			<input
				class="w-72 flex-1"
				bind:value={filterState.searchTerm}
				type="text"
				placeholder="Search..."
				id="searchInput"
			/>
			<button class="!px-2" onclick={resetFilters}>
				<span class="material-symbols-outlined !text-md ml-2 text-zinc-300">close</span>
			</button>
		</div>

		<!-- Filter -->
		<button
			class="bg-blue-800 hover:bg-blue-900"
			onclick={() => (filterState.showFilters = !filterState.showFilters)}
			aria-label="Filters"
		>
			<span class="material-symbols-outlined !text-md">tune</span>
			<span> Filters </span>
		</button>
	</div>
</div>

<style lang="postcss">
	@reference "../../app.css";

	input {
		outline: none;
		border: none;
		@apply bg-zinc-950;
		@apply rounded-xl;
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

	button {
		@apply flex cursor-pointer flex-row items-center space-x-1 rounded-xl px-4 py-2 font-bold;
	}
</style>
