<script lang="ts">
	import type { Video, Playlist, Flag } from '$lib/types';
	import { Genre, Instrument, Tag, Tuning } from '$lib';
	import { Modal, FilterProperty } from '$lib/components';
	import { playlistState, layoutState } from '$lib';

	// Use video url instead of id
	// allows the copy paste of full urls insetad of spending more time isolating the id
	type VideoYoutubeUrl = {
		id: string;
		title: string;
		artist: string;
		tags: Tag[];
		youtubeUrl: string;
		flags: Flag[];
		lastPlayed: string;
	};

	let genres: Genre[] = $state([]);
	let instruments: Instrument[] = $state([]);
	let tunings: Tuning[] = $state([]);
	let videos: VideoYoutubeUrl[] = $state([]);
	let newVideos: VideoYoutubeUrl[] = $state([]);
	let title = $state('');
	let artist = $state('');

	let videoIdsToDelete: string[] = $state([]);

	$effect(() => {
		if (playlistState.editPlaylist) {
			genres = playlistState.editPlaylist.genres;
			instruments = playlistState.editPlaylist.instruments;
			tunings = playlistState.editPlaylist.tunings;
			videos = playlistState.editPlaylist.videos.map((video) => {
				return {
					id: video.id,
					title: video.title,
					artist: video.artist,
					tags: video.tags,
					flags: video.flags,
					lastPlayed: video.lastPlayed,
					youtubeUrl: 'https://www.youtube.com/watch?v=' + video.youtubeId
				};
			});
			title = playlistState.editPlaylist.title;
			artist = playlistState.editPlaylist.artist;
			videoIdsToDelete = [];
			newVideos = [];
		}

		if (!layoutState.showEditPlaylist) {
			playlistState.editPlaylist = undefined;
		}
	});

	function addVideo() {
		newVideos.push({
			id: '',
			title: '',
			artist: '',
			youtubeUrl: '',
			lastPlayed: new Date().toISOString(),
			tags: [],
			flags: []
		});
	}

	function removeVideo(index: number) {
		let video = videos.at(index);
		if (video && videos.length + newVideos.length > 1) {
			videoIdsToDelete.push(video.id);
			videos.splice(index, 1);
		}
	}

	function removeNewVideo(index: number) {
		if (videos.length + newVideos.length > 1) {
			newVideos.splice(index, 1);
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
		// Make sure we have something to update
		if (!playlistState.editPlaylist) return;

		const formData = new FormData(event.currentTarget);

		formData.set('genres', JSON.stringify(genres));
		formData.set('instruments', JSON.stringify(instruments));
		formData.set('tunings', JSON.stringify(tunings));

		formData.set('playlistId', playlistState.editPlaylist.id);

		const playlistResponse = await fetch('/api/playlist', {
			method: 'PATCH',
			body: formData
		});

		const updatedPlaylist: Playlist = await playlistResponse.json();

		let oldestLastPlayedDate = new Date();
		let updatedVideos = [];
		// PATCH the old videos
		for (const video of videos) {
			const youtubeId = youtubeUrlToId(video.youtubeUrl);

			if (youtubeId) {
				const data = JSON.stringify({
					videoId: video.id,
					title: video.title,
					artist: video.artist,
					youtubeId: youtubeId,
					playlistId: updatedPlaylist.id,
					tags: JSON.stringify(video.tags),
					lastPlayed: video.lastPlayed
				});

				const videoResponse = await fetch('/api/video', {
					method: 'PATCH',
					body: data
				});

				oldestLastPlayedDate = new Date(
					Math.min(oldestLastPlayedDate.getTime(), new Date(video.lastPlayed).getTime())
				);

				const updatedVideo: Video = await videoResponse.json();
				updatedVideo.flags = video.flags;

				updatedVideos.push(updatedVideo);
			}
		}
		// Create the new Videos
		for (const [index, video] of newVideos.entries()) {
			const youtubeId = youtubeUrlToId(video.youtubeUrl);

			if (youtubeId) {
				const data = JSON.stringify({
					title: video.title,
					artist: video.artist,
					youtubeId: youtubeId,
					playlistId: updatedPlaylist.id,
					lastPlayed: oldestLastPlayedDate.setSeconds(oldestLastPlayedDate.getSeconds() - index),
					tags: JSON.stringify(video.tags)
				});

				const videoResponse = await fetch('/api/video', {
					method: 'POST',
					body: data
				});

				const updatedVideo: Video = await videoResponse.json();

				updatedVideos.push(updatedVideo);
			}
		}
		// DELETE videos
		for (const videoId of videoIdsToDelete) {
			const response = await fetch('/api/video', {
				method: 'DELETE',
				body: JSON.stringify({ videoId: videoId })
			});
		}

		updatedPlaylist.videos = updatedVideos;

		// Update state
		let playlistIndex = playlistState.playlists.findIndex(
			(playlist) => playlist.id == updatedPlaylist.id
		);
		playlistState.playlists.splice(playlistIndex, 1);
		playlistState.playlists.splice(playlistIndex, 0, updatedPlaylist);

		// RESET
		if (playlistState.selectedPlaylist?.id == updatedPlaylist.id) {
			playlistState.selectedPlaylist = updatedPlaylist;
			// select most recently played video
			if (playlistState.selectedPlaylist.videos?.length > 0) {
				playlistState.selectedVideo = playlistState.selectedPlaylist.videos.reduce(
					(mostRecent, current) => {
						const dateMostRecent = new Date(mostRecent.lastPlayed).getTime();
						const dateCurrent = new Date(current.lastPlayed).getTime();
						return dateCurrent > dateMostRecent ? current : mostRecent;
					},
					playlistState.selectedPlaylist.videos[0]
				);
			}
		}
		layoutState.showEditPlaylist = false;
	}
</script>

<Modal
	bind:showModal={layoutState.showEditPlaylist}
	closeOnClickOutside={false}
	title={'Edit Playlist'}
>
	<form id="edit-playlist" onsubmit={onSubmit}>
		<div class="flex flex-col space-y-2">
			<!-- TEXT -->
			<div class="mt-2 flex flex-col space-y-2 px-2">
				<input
					bind:value={title}
					autocomplete="off"
					name="title"
					type="text"
					required
					placeholder="Title..."
				/>
				<input
					bind:value={artist}
					autocomplete="off"
					name="artist"
					type="text"
					required
					placeholder="Artist..."
				/>
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

			<div class="flex max-h-[415px] flex-col space-y-2 overflow-auto px-2">
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
						<button class="!px-2" type="button" onclick={() => removeVideo(index)}>
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
				{#each newVideos as video, index}
					<div class="flex flex-row items-center space-x-2">
						<input
							class="grow-1"
							autocomplete="off"
							type="text"
							placeholder="Youtube Url..."
							required
							bind:value={video.youtubeUrl}
						/>
						<button type="button" onclick={() => removeNewVideo(index)}>
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
		<div class="mx-2 mt-4 mb-2 flex flex-row space-x-2">
			<button type="button" class="ml-auto" onclick={addVideo}>
				<span class="material-symbols-outlined">youtube_activity</span>
				<span>Add Video</span>
			</button>
			<button type="submit">
				<span class="material-symbols-outlined !mt-1">edit_note</span>
				<span>Update Playlist</span>
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
