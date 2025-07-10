<script lang="ts">
	import type { Playlist, Genre, Instrument, Tag, Tuning } from '$lib';
	import { filterState } from '$lib';
</script>

<div class="flex flex-row items-center justify-between p-4">
	<!-- LEFT -->
	<!-- Title -->
	<span class="text-lg"> Play-With-Me </span>

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

		<!-- Add Playlist -->
		<button
			class="bg-red-800 hover:bg-red-900"
			onclick={() => (filterState.showFilters = !filterState.showFilters)}
			aria-label="Filters"
		>
			<span class="material-symbols-outlined !text-md">add_circle</span>
			<span> Add Playlist </span>
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
