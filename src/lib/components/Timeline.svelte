<script lang="ts">
	import type { Playlist, Genre, Instrument, Tag, Tuning } from '$lib';

	let timeValue = $state('');
	let nameValue = $state('');
</script>

<div class="flex h-48 flex-col rounded-xl pt-2">
	<!-- NAV -->
	<div class="flex w-full flex-row justify-between">
		<!-- Left -->
		<div class="flex flex-row space-x-2">
			<!-- Flag name -->
			<div class="flex flex-row items-center space-x-1">
				<span class="material-symbols-outlined">flag</span>
				<span>Flag Name</span>
			</div>
			<!-- Flag time -->
			<div class="flex flex-row items-center space-x-1">
				<span class="material-symbols-outlined">alarm</span>
				<span>Time</span>
			</div>
			<!-- Seek -->
			<button type="button" onclick={() => null} aria-label="Add Playlist">
				<span class="material-symbols-outlined">video_search</span>
				<span> Seek </span>
			</button>
			<!-- Delete -->
			<button type="button" onclick={() => null} aria-label="Add Playlist">
				<span class="material-symbols-outlined">close</span>
				<span> Delete </span>
			</button>
		</div>

		<!-- Right -->
		<div class="flex flex-row space-x-2">
			<!-- Add -->
			<button type="button" onclick={() => null} aria-label="Add Playlist">
				<span class="material-symbols-outlined">add_circle</span>
				<span> Add Flag </span>
			</button>
			<!-- Flag Assign -->
			<button type="button" onclick={() => null} aria-label="Add Playlist">
				<span class="material-symbols-outlined">flag_check</span>
				<span> Flag Assign </span>
			</button>
		</div>
	</div>

	<!-- Timeline -->
	<div></div>
</div>

<style lang="postcss">
	@reference "../../app.css";

	button {
		@apply flex cursor-pointer flex-row items-center space-x-1;
		@apply rounded-xl bg-zinc-800 px-4 py-2 hover:bg-zinc-700;
	}

	.material-symbols-outlined {
		@apply text-zinc-300;
	}
</style>
