<script lang="ts">
	import { Genre, Instrument, Tag, Tuning } from '$lib';
	import { FilterProperty } from '$lib/components';
  import {}

	let genres = $state([]);
	let instruments = $state([]);
	let tunings = $state([]);

	// let videos: Video[] = $state([]);

	async function onSubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		const formData = new FormData(event.currentTarget);

		formData.set('genres', JSON.stringify(genres));
		formData.set('instruments', JSON.stringify(instruments));
		formData.set('tunings', JSON.stringify(tunings));

		const response = await fetch('/api/playlist', {
			method: 'POST',
			body: formData
		});

		const { data } = await response.json();

		console.log(data.createPlaylistRecordModel);



		// event.currentTarget.reset();
		genres = [];
		instruments = [];
		tunings = [];
	}
</script>

<form onsubmit={onSubmit}>
	<div class="flex flex-col space-y-2">
		<!-- TEXT -->
		<div class="flex flex-row space-x-2">
			<div class="flex flex-col">
				<label> Title </label>
				<input name="title" type="text" placeholder="Title..." />
			</div>
			<div class="flex flex-col">
				<label> Artist </label>
				<input name="artist" type="text" placeholder="Artist..." />
			</div>
		</div>

		<div class="mb-4 rounded-xl bg-zinc-950 p-2">
			<FilterProperty
				bind:list={genres}
				title={'Genres'}
				icon={'music_note'}
				color={'red'}
				values={Object.values(Genre)}
			/>
			<FilterProperty
				bind:list={instruments}
				title={'Instruments'}
				icon={'piano'}
				color={'amber'}
				values={Object.values(Instrument)}
			/>
			<FilterProperty
				bind:list={tunings}
				title={'Tunings'}
				icon={'graphic_eq'}
				color={'purple'}
				values={Object.values(Tuning)}
			/>
		</div>

		<div></div>
	</div>

	<button type="submit" class="bg-blue-800 hover:bg-blue-900"> Create Playlist </button>
</form>

<style lang="postcss">
	@reference "../../app.css";

	label {
		@apply text-sm text-zinc-300;
	}

	input {
		outline: none;
		border: none;
		@apply rounded-xl bg-zinc-950 text-zinc-100;
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
