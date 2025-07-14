<script lang="ts">
	import { Filter } from '$lib/components';
	import { playlistState, filterState } from '$lib';

	let filteredPlaylists = $derived(
		playlistState.playlists.filter((x) => {
			let titles = x.title.includes(filterState.searchTerm);
			let artists = x.artist.includes(filterState.searchTerm);
			let tags = filterState.tags.every((tag) => x.videos?.some((video) => video.tag == tag));
			let genres = filterState.genres.every((genre) => x.genres.includes(genre));
			let instruments = filterState.instruments.every((instrument) =>
				x.instruments.includes(instrument)
			);
			let tunings = filterState.tunings.every((tuning) => x.tunings.includes(tuning));
			return (titles || artists) && tags && genres && instruments && tunings;
		})
	);
</script>

<div class="flex w-[440px] flex-col">
	<Filter />

	<div class="my-4 flex-1 overflow-auto">
		{#each filteredPlaylists as playlist}
			<!-- Playlist -->
			<button
				class={playlistState.selectedPlaylist?.id == playlist.id ? 'bg-zinc-800' : ''}
				onclick={() => {
					playlistState.selectedPlaylist = playlist;
					playlistState.selectedVideo =
						playlist.videos?.length > 0 ? playlist.videos[0] : undefined;
				}}
			>
				<div class="flex flex-row space-x-2">
					{#if playlist.videos?.length > 0}
						<img
							class="w-32 rounded-xl"
							src={'http://img.youtube.com/vi/' + playlist.videos[0].youtubeId + '/mqdefault.jpg'}
							alt=""
						/>
					{/if}

					<div class="flex flex-col items-start space-x-1">
						<span
							class={playlistState.selectedPlaylist?.id == playlist.id
								? 'title pl-1'
								: 'title pl-1'}
							>{playlist.title}
						</span>
						<span class="pl-1 text-xs font-light text-zinc-300">{playlist.artist}</span>
						<div class="flex flex-row space-x-1 overflow-hidden">
							{#each playlist?.videos as video}
								<div class="rounded-lg bg-blue-950 px-2 text-sm">
									{video.tag}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</button>
		{/each}
	</div>
	<!-- VIDEOS -->
	<div class="flex h-48 flex-col overflow-auto rounded-xl bg-zinc-950 p-2">
		<!-- Videos -->
		{#if playlistState.selectedPlaylist}
			{#each playlistState.selectedPlaylist.videos as video}
				<button
					class={playlistState.selectedVideo?.id == video.id ? 'bg-zinc-800' : ''}
					onclick={() => {
						playlistState.selectedVideo = video;
					}}
				>
					<div class="flex h-[60px] flex-row space-x-2">
						<img
							class="rounded-xl"
							src={'http://img.youtube.com/vi/' + video.youtubeId + '/mqdefault.jpg'}
							alt=""
						/>
						<div class="flex flex-col items-start justify-start">
							<span>{video.title}</span>
							<span class="text-xs font-light text-zinc-300">{video.artist}</span>
						</div>
					</div>
				</button>
			{/each}
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "../../app.css";

	button {
		@apply w-full cursor-pointer p-2;
	}

	button:hover {
		@apply bg-zinc-800;
	}
</style>
