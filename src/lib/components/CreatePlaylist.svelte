<script lang="ts">
	import { Genre, Instrument, Tag, Tuning } from '$lib';
	import { FilterProperty } from '$lib/components';

	let tags = $state([]);
	let genres = $state([]);
	let instruments = $state([]);
	let tunings = $state([]);

	function onSubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
		// event.preventDefault();
		const formData = new FormData(event.currentTarget);

		formData.set('tags', JSON.stringify(tags));
		formData.set('genres', JSON.stringify(genres));
		formData.set('instruments', JSON.stringify(instruments));
		formData.set('tunings', JSON.stringify(tunings));

		// const data = {};
		// for (let field of formData) {
		// 	const [key, value] = field;
		// 	data[key] = value;
		// }
		// console.log(data);

		fetch('/api/playlist', {
			method: 'POST',
			body: formData
		});
	}
</script>

<form onsubmit={onSubmit}>
	<!-- TEXT -->

	<div class="flex flex-row space-x-2">
		<label>
			Title
			<input name="title" type="text" />
		</label>
		<label>
			Artist
			<input name="artist" type="text" />
		</label>

		<div class="mb-4 rounded-xl bg-zinc-950 p-2">
			<FilterProperty
				bind:list={tags}
				title={'Tags'}
				icon={'sell'}
				color={'blue'}
				values={Object.values(Tag)}
			/>
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

	<button type="submit"> Create Playlist </button>
</form>

<style>
	@reference "../../app.css";

	button {
		@apply cursor-pointer;
	}
</style>
