<script lang="ts">
	import type { Video, Playlist } from '$lib/types';
	import { Genre, Instrument, Tag, Tuning } from '$lib';
	import { Modal, FilterProperty } from '$lib/components';
	import { playlistState } from '$lib';
	import { layoutState } from '$lib';

	let genres = $state([]);
	let instruments = $state([]);
	let tunings = $state([]);
	let videos = $state([
		{
			title: '',
			artist: '',
			youtubeUrl: '',
			tags: [],
			flags: []
		}
	]);

	function addVideo() {
		videos.push({
			title: '',
			artist: '',
			youtubeUrl: '',
			tags: [],
			flags: []
		});
	}

	function removeVideo(index: number) {
		if (videos.length > 1) {
			videos.splice(index, 1);
		}
	}

	function youtubeUrlToId(url: string): string | undefined {
		let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
		let match = url.match(regExp);
		if (match && match[2].length == 11) {
			return match[2];
		} else {
			//error
		}
	}

	async function onSubmit(
		event: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
			originalTarget: EventTarget & HTMLFormElement;
		}
	) {
		const formData = new FormData(event.currentTarget);

		formData.set('genres', JSON.stringify(genres));
		formData.set('instruments', JSON.stringify(instruments));
		formData.set('tunings', JSON.stringify(tunings));

		const playlistResponse = await fetch('/api/playlist', {
			method: 'POST',
			body: formData
		});

		const createdPlaylist: Playlist = await playlistResponse.json();

		// Add the videos
		for (const video of videos) {
			const youtubeId = youtubeUrlToId(video.youtubeUrl);

			if (youtubeId) {
				const data = JSON.stringify({
					title: video.title,
					artist: video.artist,
					youtubeId: youtubeId,
					playlistId: createdPlaylist.id,
					tags: JSON.stringify(video.tags)
				});

				const videoResponse = await fetch('/api/video', {
					method: 'POST',
					body: data
				});

				const createdVideo: Video = await videoResponse.json();

				createdVideo.flags = [];
				createdPlaylist.videos.push(createdVideo);
			}
		}

		// Update state
		createdPlaylist.notes = [];
		playlistState.playlists.unshift(createdPlaylist);

		// RESET
		layoutState.showCreatePlaylist = false;
		event.originalTarget.reset();
		genres = [];
		instruments = [];
		tunings = [];
		videos = [
			{
				title: '',
				artist: '',
				youtubeUrl: '',
				tags: [],
				flags: []
			}
		];
	}
</script>

<Modal
	bind:showModal={layoutState.showCreatePlaylist}
	closeOnClickOutside={false}
	title={'Create Playlist'}
>
	<form id="create-playlist" onsubmit={onSubmit}>
		<div class="flex flex-col space-y-2">
			<!-- TEXT -->
			<div class="flex flex-col space-y-2">
				<input autocomplete="off" name="title" type="text" required placeholder="Title..." />
				<input autocomplete="off" name="artist" type="text" required placeholder="Artist..." />
			</div>

			<div class="mb-2 rounded-xl bg-zinc-950">
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

			<div class="flex max-h-[415px] flex-col space-y-2 overflow-auto">
				{#each videos as video, index}
					<div class="flex flex-row items-center space-x-2">
						<input
							class="grow-1"
							autocomplete="off"
							type="text"
							placeholder="Youtube Url..."
							required
							bind:value={video.youtubeUrl}
						/>
						<button type="button" onclick={() => removeVideo(index)}>
							<span class="material-symbols-outlined">close</span>
						</button>
					</div>
					<div class="flex flex-row items-center space-x-2">
						<input
							class="grow-1"
							autocomplete="off"
							required
							type="text"
							placeholder="Title..."
							bind:value={video.title}
						/>
						<input
							class="grow-1"
							autocomplete="off"
							type="text"
							required
							placeholder="Artist..."
							bind:value={video.artist}
						/>
					</div>
					<FilterProperty
						bind:list={video.tags}
						title={'Tags'}
						icon={'sell'}
						color={'blue'}
						values={Object.values(Tag)}
					/>
				{/each}
			</div>
		</div>

		<!-- Buttons -->
		<div class="mt-4 flex flex-row space-x-2">
			<button type="button" class="ml-auto" onclick={addVideo}>
				<span class="material-symbols-outlined">youtube_activity</span>
				<span>Add Video</span>
			</button>
			<button type="submit">
				<span class="material-symbols-outlined">add_circle</span>
				<span>Create Playlist</span>
			</button>
		</div>
	</form>
</Modal>

<style lang="postcss">
	@reference "../../app.css";

	input {
		outline: none;
		border: none;
		@apply rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100;
	}
	input:focus {
		box-shadow: none;
		outline: none;
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
