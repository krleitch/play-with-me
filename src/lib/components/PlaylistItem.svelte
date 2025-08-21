<script lang="ts">
	import { playlistState, layoutState, youtubeState } from '$lib';
	import { clickOutside } from '$lib';
	import type { Playlist } from '$lib/types';

	interface PlaylistItem {
		playlist: Playlist;
	}
	let { playlist }: PlaylistItem = $props();

	let showDropdown = $state(false);

	async function deletePlaylist() {
		if (window.confirm('Are you sure you would like to delete this playlist?')) {
			const response = await fetch('/api/playlist', {
				method: 'DELETE',
				body: JSON.stringify({ playlistId: playlist.id })
			});

			const deleteResponse = await response.json();

			playlistState.playlists = playlistState.playlists.filter((p) => p.id !== playlist.id);
			showDropdown = false;
		} else {
			showDropdown = false;
		}
	}

	function editPlaylist() {
		playlistState.editPlaylist = playlist;
		layoutState.showEditPlaylist = true;
		showDropdown = false;
	}

	function toggleFavouritePlaylist() {
		const favouriteResponse = fetch('/api/playlist/favourite', {
			method: 'PATCH',
			body: JSON.stringify({ playlistId: playlist.id, favourite: !playlist.favourite })
		});
		playlist.favourite = !playlist.favourite;
		showDropdown = false;
	}

	function selectPlaylist() {
		playlistState.selectedPlaylist = playlist;

		// select most recently played video
		if (playlist.videos?.length > 0) {
			playlistState.selectedVideo = playlist.videos.reduce((mostRecent, current) => {
				const dateMostRecent = new Date(mostRecent.lastPlayed).getTime();
				const dateCurrent = new Date(current.lastPlayed).getTime();
				return dateCurrent > dateMostRecent ? current : mostRecent;
			}, playlist.videos[0]);
		}

		const lastPlayedResponse = fetch('/api/playlist/lastPlayed', {
			method: 'PATCH',
			body: JSON.stringify({ playlistId: playlist.id, views: playlist.views + 1 })
		});
		playlist.lastPlayed = new Date().toISOString();
		playlist.views = playlist.views + 1;
	}
</script>

<playlist-item class={playlistState.selectedPlaylist?.id == playlist.id ? 'bg-zinc-900' : ''}>
	<div class="flex h-[65px]">
		<button
			type="button"
			class="flex w-full flex-row space-x-2"
			onclick={() => {
				if (youtubeState.youtubePlayer == undefined) {
					// if you didnt autoplay the first video, you could wait for the video player here
				} else {
					selectPlaylist();
				}
			}}
		>
			{#if playlist.videos?.length > 0}
				<!-- IMG -->
				<img
					class="rounded-md"
					src={'http://img.youtube.com/vi/' + playlist.videos[0].youtubeId + '/mqdefault.jpg'}
					alt=""
				/>
			{/if}

			<div class="flex w-full flex-col items-start space-x-1">
				<!-- TITLE -->
				<div class="flex w-full flex-row justify-between pl-1">
					<span class="text-left">{playlist.title} </span>
				</div>
				<!-- ARTIST -->
				<span class="pl-1 text-xs font-light text-zinc-300">{playlist.artist}</span>
			</div>
		</button>

		<!-- Dropdown -->
		<div class="relative">
			<button class="mb-auto ml-1" type="button" onclick={() => (showDropdown = true)}>
				<span class="material-symbols-outlined !text-md">more_vert</span>
			</button>
			{#if showDropdown}
				<div
					use:clickOutside={() => {
						showDropdown = false;
					}}
					class="absolute top-6 right-0 z-100 flex w-38 flex-col rounded-xl"
				>
					<button
						class="flex flex-row items-center space-x-1 rounded-tl-xl rounded-tr-xl bg-zinc-800 p-2 hover:bg-zinc-700"
						type="button"
						onclick={editPlaylist}
					>
						<span class="material-symbols-outlined !mt-1">edit_note</span>
						<span>Edit Playlist</span>
					</button>
					<button
						class="flex flex-row items-center space-x-1 bg-zinc-800 p-2 hover:bg-zinc-700"
						type="button"
						onclick={toggleFavouritePlaylist}
					>
						{#if playlist.favourite}
							<span class="material-symbols-outlined !text-yellow-500">star</span>
						{:else}
							<span class="material-symbols-outlined">star</span>
						{/if}
						<span> Favourite</span>
					</button>
					<button
						class="flex flex-row items-center space-x-1 rounded-br-xl rounded-bl-xl bg-zinc-800 p-2 hover:bg-zinc-700"
						type="button"
						onclick={deletePlaylist}
					>
						<span class="material-symbols-outlined">delete_forever</span>
						<span>Delete Playlist </span>
					</button>
				</div>
			{/if}
		</div>
	</div>
</playlist-item>

<style lang="postcss">
	@reference "../../app.css";

	playlist-item {
		@apply w-full cursor-pointer p-1 hover:bg-zinc-900;
	}

	button {
		@apply cursor-pointer;
	}

	.material-symbols-outlined {
		@apply text-zinc-300;
	}
</style>
