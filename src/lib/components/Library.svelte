<script lang="ts">
	import type { Playlist } from '$lib';
	import { Genre, Instrument, Tag, Tuning } from '$lib';
	import { Filter } from '$lib/components';
	import { slide, fade } from 'svelte/transition';
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

	<div class="">
		{#each filteredPlaylists as playlist}
			<!-- Playlist -->
			<button
				class={playlistState.selectedPlaylist?.id == playlist.id
					? 'rounded-tl-xl rounded-tr-xl bg-zinc-800'
					: 'rounded-xl'}
				onclick={() => {
					playlistState.selectedPlaylist = playlist;
					playlistState.selectedVideo = playlist.videos.length > 0 ? playlist.videos[0] : undefined;
				}}
			>
				<div class="flex flex-row space-x-2">
					{#if playlist.videos.length > 0 && playlistState.selectedPlaylist?.id !== playlist.id}
						<img
							transition:slide={{ axis: 'x', delay: 350 }}
							class="w-32 rounded-xl"
							src={'http://img.youtube.com/vi/' + playlist.videos[0].youtubeId + '/mqdefault.jpg'}
							alt=""
						/>
					{/if}

					<div class="flex flex-col items-start space-x-1">
						<span
							class={playlistState.selectedPlaylist?.id == playlist.id
								? 'title pl-1 text-amber-100'
								: 'title pl-1'}
							>{playlist.title}
						</span>
						<span class="pl-1 text-xs font-light text-zinc-300">{playlist.artist}</span>
						<div class="flex flex-row space-x-1 overflow-hidden">
							{#each playlist.tags as tag}
								<div class="rounded-lg bg-blue-950 px-2 text-sm">
									{tag}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</button>

			{#if playlistState.selectedPlaylist?.id == playlist.id}
				<!-- Videos -->
				<div transition:slide>
					{#each playlist.videos as video}
						<button
							class="flex flex-row space-x-2 bg-zinc-800 p-2 last:rounded-br-xl last:rounded-bl-xl"
							onclick={() => {
								playlistState.selectedVideo = video;
							}}
						>
							<img
								class="w-32 rounded-xl"
								src={'http://img.youtube.com/vi/' + video.youtubeId + '/mqdefault.jpg'}
								alt=""
							/>
							<div class="flex flex-col items-start justify-start">
								<span
									class={playlistState.selectedVideo?.id == video.id
										? 'title text-amber-100'
										: 'title'}>{video.title}</span
								>
								<span class="text-xs font-light text-zinc-300">{video.artist}</span>
							</div>
						</button>
					{/each}
				</div>
			{/if}
		{/each}
	</div>
</div>

<style lang="postcss">
	@reference "../../app.css";

	button {
		@apply w-full cursor-pointer p-2;
	}
	button:hover .title {
		@apply text-amber-100;
	}
</style>
