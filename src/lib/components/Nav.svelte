<script lang="ts">
	import { MIDIState, filterState, layoutState, playlistState } from '$lib';
	import { onMount } from 'svelte';

	let sortType: 'created' | 'recent' | undefined = $state(undefined);

	onMount(() => {
		let defaultSort = localStorage.getItem('sort');
		if (defaultSort == 'created') {
			sortType = defaultSort;
		} else if (defaultSort == 'recent') {
			sortType = defaultSort;
		} else {
			localStorage.setItem('sort', 'created');
		}
	});

	function resetFilters() {
		filterState.tags = [];
		filterState.genres = [];
		filterState.tunings = [];
		filterState.instruments = [];
		filterState.searchTerm = '';
	}

	function toggleFavourite() {
		filterState.showFavourites = !filterState.showFavourites;
	}

	function toggleSort() {
		if (playlistState.playlists) {
			if (sortType == 'created') {
				sortType = 'recent';
				localStorage.setItem('sort', 'recent');
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
				localStorage.setItem('sort', 'created');
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

	function openTuner() {
		if (MIDIState.selectedMIDIOutput) {
			const ccMessage = [0xb0, 0x44, 0x00];
			MIDIState.selectedMIDIOutput.send(ccMessage);
		}
	}
</script>

<div class="flex flex-row items-center justify-between px-4 py-4 lg:px-28">
	<!-- LEFT -->
	<div class="flex h-[40px] flex-row space-x-2">
		<!-- Create Playlist -->
		<button
			type="button"
			onclick={() => (layoutState.showCreatePlaylist = true)}
			aria-label="Create Playlist"
		>
			<span class="material-symbols-outlined !mt-1">playlist_add</span>
			<span class="ml-1 hidden lg:block"> Create Playlist </span>
		</button>

		<!-- Toggle Library -->
		<button
			type="button"
			onclick={() => (layoutState.showLibrary = !layoutState.showLibrary)}
			aria-label="Library"
		>
			<span class="material-symbols-outlined">newsstand</span>
			<span class="ml-1 hidden lg:block"> Library </span>
		</button>

		<!-- Toggle Notes -->
		<button
			type="button"
			onclick={() => (layoutState.showNotes = !layoutState.showNotes)}
			aria-label="Notes"
		>
			<span class="material-symbols-outlined">edit</span>
			<span class="ml-1 hidden lg:block"> Notes </span>
		</button>
		<!-- Global MIDI -->
		<button
			type="button"
			onclick={() => (layoutState.showGlobalMidi = !layoutState.showGlobalMidi)}
			aria-label="Global MIDI"
		>
			<span class="material-symbols-outlined">globe</span>
			<span class="ml-1 hidden lg:block"> Global MIDI </span>
		</button>
		<!-- Disable MIDI -->
		<button
			type="button"
			class={MIDIState.disableMIDI ? '!bg-rose-900' : ''}
			onclick={() => (MIDIState.disableMIDI = !MIDIState.disableMIDI)}
			aria-label="Disable MIDI"
		>
			<span class="material-symbols-outlined">piano_off</span>
			<span class="ml-1 hidden lg:block"> Disable MIDI </span>
		</button>
		{#if MIDIState.selectedMIDIOutput && MIDIState.selectedMIDIOutput.name == 'Line 6 HX Stomp'}
			<button type="button" onclick={openTuner} aria-label="HxStomp Tuner">
				<span class="material-symbols-outlined">graphic_eq</span>
				<span class="ml-1 hidden lg:block"> HxStomp Tuner </span>
			</button>
		{:else if !MIDIState.selectedMIDIOutput}
			<div class="flex flex-row items-center text-nowrap">
				<span class="material-symbols-outlined !text-yellow-500">warning</span>
				<span class="ml-1 text-yellow-500">MIDI Device Closed</span>
			</div>
		{/if}
	</div>

	<!-- RIGHT -->
	<div class="ml-2 flex flex-row items-center space-x-2">
		<!-- Sort -->
		{#if sortType}
			<button class="!px-2" type="button" onclick={toggleSort} aria-label="Sort">
				<!-- <span class="material-symbols-outlined">sort</span> -->
				{#if sortType == 'created'}
					<!-- <span> Created </span> -->
					<span class="material-symbols-outlined">calendar_clock</span>
				{:else if sortType == 'recent'}
					<!-- <span> Recent </span> -->
					<span class="material-symbols-outlined">update</span>
				{/if}
			</button>
		{/if}

		<!-- Input -->
		<div class="flex flex-row items-center rounded-xl border border-zinc-800 bg-zinc-950">
			<span class="material-symbols-outlined ml-2">search</span>
			<input
				class="w-68 flex-1"
				bind:value={filterState.searchTerm}
				type="text"
				placeholder="Search..."
				id="searchInput"
			/>
			<button
				type="button"
				class="!rounded-tl-none !rounded-bl-none !bg-zinc-950 !px-2 hover:!bg-zinc-950"
				onclick={resetFilters}
			>
				<span class="material-symbols-outlined">close</span>
			</button>
		</div>

		<!-- Filter -->
		<button
			type="button"
			class="!px-2"
			onclick={() => (filterState.showFilters = !filterState.showFilters)}
			aria-label="Filters"
		>
			<span class="material-symbols-outlined">tune</span>
		</button>

		<!-- Favourite -->
		<button class="!px-2" type="button" onclick={toggleFavourite} aria-label="Sort">
			{#if filterState.showFavourites}
				<span class="material-symbols-outlined !text-yellow-500">star</span>
			{:else}
				<span class="material-symbols-outlined">star</span>
			{/if}
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
		@apply flex cursor-pointer flex-row items-center text-nowrap;
		@apply rounded-xl bg-zinc-800 px-2 py-2 hover:bg-zinc-700 lg:px-4;
	}

	.material-symbols-outlined {
		@apply text-zinc-300;
	}
</style>
