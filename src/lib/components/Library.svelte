<script lang="ts">
	import { Filter, PlaylistItem, VideoItem } from '$lib/components';
	import { playlistState, filterState } from '$lib';

	let { showPlaylists } = $props();

	let filteredPlaylists = $derived(
		playlistState.playlists.filter((x) => {
			let favourite = filterState.showFavourites ? x.favourite : true;

			let titles = x.title.toLowerCase().includes(filterState.searchTerm.toLowerCase());
			let artists = x.artist.toLowerCase().includes(filterState.searchTerm.toLowerCase());
			let tags =
				filterState.tags.length > 0
					? filterState.tags.some((tag) => x.videos?.some((video) => video.tags.includes(tag)))
					: true;
			let genres =
				filterState.genres.length > 0
					? filterState.genres.some((genre) => x.genres.includes(genre))
					: true;
			let instruments =
				filterState.instruments.length > 0
					? filterState.instruments.some((instrument) => x.instruments.includes(instrument))
					: true;
			let tunings =
				filterState.tunings.length > 0
					? filterState.tunings.some((tuning) => x.tunings.includes(tuning))
					: true;
			return (titles || artists) && favourite && tags && genres && instruments && tunings;
		})
	);
</script>

<div class="flex w-[440px] flex-col">
	<Filter />

	<div class="mb-2 flex flex-1 flex-col overflow-auto">
		<!-- Playlist -->
		{#if showPlaylists}
			{#each filteredPlaylists as playlist (playlist.id)}
				<PlaylistItem {playlist} />
			{/each}
		{/if}
	</div>
	<!-- VIDEOS -->
	<span class="border border-zinc-800"></span>
	<div class="mt-2 flex h-48 flex-col overflow-auto">
		<!-- Videos -->
		{#if playlistState.selectedPlaylist}
			{#each playlistState.selectedPlaylist.videos as video (video.id)}
				<VideoItem {video} />
			{/each}
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "../../app.css";
</style>
