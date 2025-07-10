<script lang="ts">
	import type { Playlist, Genre, Instrument, Tag, Tuning } from '$lib';
	import { Filter } from '$lib/components';
	import { accordion } from '$lib';
	import { playlistState, filterState } from '$lib';

	interface Props {
		playlists: Playlist[];
	}
	let { playlists }: Props = $props();

	let filteredPlaylists = $derived(
		playlists.filter((x) => {
			let titles = x.title.includes(filterState.searchTerm);
			let artists = x.artist.includes(filterState.searchTerm);
			let tags = filterState.tags.every((tag) => x.tags.includes(tag));
			let genres = filterState.genres.every((genre) => x.genres.includes(genre));
			let instruments = filterState.instruments.every((instrument) =>
				x.instruments.includes(instrument)
			);
			let tunings = filterState.tunings.every((tuning) => x.tunings.includes(tuning));
			return (titles || artists) && tags && genres && instruments && tunings;
		})
	);
</script>

<div class="w-[450px]">
	<Filter />

	<div>
		{#each filteredPlaylists as playlist}
			<button
				class={playlistState.selectedPlaylist?.id == playlist.id ? 'bg-zinc-800' : ''}
				onclick={() => {
					playlistState.selectedPlaylist = playlist;
					playlistState.selectedVideo = playlist.videos.length > 0 ? playlist.videos[0] : undefined;
				}}
			>
				<div class="flex flex-col items-start space-x-1">
					<span class="pl-1">{playlist.title}</span>
					<span class="pl-1 text-xs text-zinc-300">{playlist.artist}</span>
					<div class="flex flex-row space-x-1 overflow-hidden">
						{#each playlist.tags as tag}
							<div class="rounded-lg bg-blue-950 px-2 text-sm">
								{tag}
							</div>
						{/each}
					</div>
				</div>
			</button>

			<!-- Show Videos -->
			<div use:accordion={playlistState.selectedPlaylist?.id == playlist.id}>
				{#each playlist.videos as video}
					<button
						class="flex flex-row space-x-2 bg-zinc-800 p-2"
						onclick={() => {
							playlistState.selectedVideo = video;
						}}
					>
						<img
							class="w-32 rounded-lg"
							src={'http://img.youtube.com/vi/' + video.youtubeId + '/mqdefault.jpg'}
							alt=""
						/>
						<div class="flex flex-col items-start justify-start">
							<span class={playlistState.selectedVideo?.id == video.id ? 'text-amber-100' : ''}
								>{video.title}</span
							>
							<span class="text-sm text-zinc-300">{video.artist}</span>
						</div>
					</button>
				{/each}
			</div>
		{/each}
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
