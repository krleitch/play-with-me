<script lang="ts">
	import { MIDIState, filterState, layoutState, playlistState } from '$lib';

	let sortType: 'created' | 'recent' = $state('created');

	function resetFilters() {
		filterState.tags = [];
		filterState.genres = [];
		filterState.tunings = [];
		filterState.instruments = [];
		filterState.searchTerm = '';
	}

	function toggleSort() {
		if (playlistState.playlists) {
			if (sortType == 'created') {
				sortType = 'recent';
				playlistState.playlists.sort((a, b) => {
					let aVal = new Date(a.lastPlayed).getTime();
					let bVal = new Date(b.lastPlayed).getTime();
					if (aVal < bVal) {
						return 1;
					} else if (aVal > bVal) {
						return -1;
					} else {
						return 0;
					}
				});
			} else {
				sortType = 'created';
				playlistState.playlists.sort((a, b) => {
					let aVal = new Date(a.created).getTime();
					let bVal = new Date(b.created).getTime();
					if (aVal < bVal) {
						return 1;
					} else if (aVal > bVal) {
						return -1;
					} else {
						return 0;
					}
				});
			}
		}
	}
</script>

<div class="flex flex-row items-center justify-between px-28 py-4">
	<!-- LEFT -->
	<div class="flex flex-row space-x-4">
		<!-- Add Playlist -->
		<button
			type="button"
			onclick={() => (layoutState.showCreatePlaylist = true)}
			aria-label="Add Playlist"
		>
			<span class="material-symbols-outlined">add_circle</span>
			<span> Add Playlist </span>
		</button>

		<!-- Toggle Library -->
		<button
			type="button"
			onclick={() => (layoutState.showLibrary = !layoutState.showLibrary)}
			aria-label="Library"
		>
			<span class="material-symbols-outlined">newsstand</span>
			<span> Library </span>
		</button>

		<!-- Toggle Notes -->
		<button
			type="button"
			onclick={() => (layoutState.showNotes = !layoutState.showNotes)}
			aria-label="Notes"
		>
			<span class="material-symbols-outlined">edit</span>
			<span> Notes </span>
		</button>
		<!-- Global MIDI -->
		<button
			type="button"
			onclick={() => (layoutState.showGlobalMidi = !layoutState.showGlobalMidi)}
			aria-label="Global MIDI"
		>
			<span class="material-symbols-outlined">globe</span>
			<span> Global MIDI </span>
		</button>
		<!-- Disable MIDI -->
		<button
			type="button"
			class={MIDIState.disableMIDI ? '!bg-rose-900' : ''}
			onclick={() => (MIDIState.disableMIDI = !MIDIState.disableMIDI)}
			aria-label="Disable MIDI"
		>
			<span class="material-symbols-outlined">piano_off</span>
			<span> Disable MIDI </span>
		</button>
	</div>

	<!-- RIGHT -->
	<div class="flex flex-row items-center space-x-4">
		<!-- Sort -->
		<button type="button" onclick={toggleSort} aria-label="Sort">
			<span class="material-symbols-outlined">sort</span>
			{#if sortType == 'created'}
				<span> Sort by recent </span>
			{:else if sortType == 'recent'}
				<span> Sort by created </span>
			{/if}
		</button>

		<!-- Input -->
		<div class="flex flex-row items-center rounded-xl border border-zinc-800 bg-zinc-950">
			<span class="material-symbols-outlined ml-2">search</span>
			<input
				class="w-60 flex-1"
				bind:value={filterState.searchTerm}
				type="text"
				placeholder="Search..."
				id="searchInput"
			/>
			<button type="button" class="!rounded-tl-none !rounded-bl-none !px-2" onclick={resetFilters}>
				<span class="material-symbols-outlined">close</span>
			</button>
		</div>

		<!-- Filter -->
		<button
			type="button"
			onclick={() => (filterState.showFilters = !filterState.showFilters)}
			aria-label="Filters"
		>
			<span class="material-symbols-outlined">tune</span>
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
		@apply flex cursor-pointer flex-row items-center space-x-1;
		@apply rounded-xl bg-zinc-800 px-4 py-2 hover:bg-zinc-700;
	}

	.material-symbols-outlined {
		@apply text-zinc-300;
	}
</style>
