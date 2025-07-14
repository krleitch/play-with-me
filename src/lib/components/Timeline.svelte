<script lang="ts">
	import type { Playlist, Genre, Instrument, Tag, Tuning } from '$lib';

	let timeValue = $state('');
	let nameValue = $state('');
</script>

<div class="flex h-48 flex-col rounded-xl py-2">
	<!-- NAV -->
	<div class="flex w-full flex-row justify-between">
		<!-- Left -->
		<div class="flex flex-row space-x-2">
			<!-- Flag name -->
			<div class="flex flex-row items-center rounded-xl bg-zinc-950 text-white">
				<span class="material-symbols-outlined !text-md ml-2 text-zinc-300">flag</span>
				<input
					class="w-72 flex-1"
					bind:value={nameValue}
					type="text"
					placeholder="Name..."
					id="nameInput"
				/>
			</div>
			<!-- Flag time -->
			<div class="flex flex-row items-center rounded-xl bg-zinc-950 text-white">
				<span class="material-symbols-outlined !text-md ml-2 text-zinc-300">alarm</span>
				<input
					class="w-24 flex-1"
					bind:value={timeValue}
					type="text"
					placeholder="Time..."
					id="timeInput"
				/>
			</div>
			<!-- Seek -->
			<button class="bg-blue-800 hover:bg-blue-900" onclick={() => null} aria-label="Add Playlist">
				<span class="material-symbols-outlined !text-md">video_search</span>
				<span> Seek </span>
			</button>
			<!-- Delete -->
			<button class="bg-blue-800 hover:bg-blue-900" onclick={() => null} aria-label="Add Playlist">
				<span class="material-symbols-outlined !text-md">close</span>
				<span> Delete </span>
			</button>
		</div>

		<!-- Right -->
		<div class="flex flex-row space-x-2">
			<!-- Add -->
			<button class="bg-blue-800 hover:bg-blue-900" onclick={() => null} aria-label="Add Playlist">
				<span class="material-symbols-outlined !text-md">add_circle</span>
				<span> Add Flag </span>
			</button>
			<!-- Flag Assign -->
			<button class="bg-blue-800 hover:bg-blue-900" onclick={() => null} aria-label="Add Playlist">
				<span class="material-symbols-outlined !text-md">flag_check</span>
				<span> Flag Assign </span>
			</button>
		</div>
	</div>

	<!-- Timeline -->
	<div></div>
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
		@apply flex cursor-pointer flex-row items-center space-x-1 rounded-xl px-2 py-1 font-bold;
	}
</style>
