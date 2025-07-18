<script lang="ts">
	import { Filter, PlaylistItem, VideoItem } from '$lib/components';
	import { playlistState, filterState } from '$lib';

	let filteredPlaylists = $derived(
		playlistState.playlists.filter((x) => {
			let favourite = filterState.showFavourites ? x.favourite : true;

			let titles = x.title.toLowerCase().includes(filterState.searchTerm.toLowerCase());
			let artists = x.artist.toLowerCase().includes(filterState.searchTerm.toLowerCase());
			let tags = filterState.tags.every((tag) =>
				x.videos?.some((video) => video.tags.includes(tag))
			);
			let genres = filterState.genres.every((genre) => x.genres.includes(genre));
			let instruments = filterState.instruments.every((instrument) =>
				x.instruments.includes(instrument)
			);
			let tunings = filterState.tunings.every((tuning) => x.tunings.includes(tuning));
			return (titles || artists) && favourite && tags && genres && instruments && tunings;
		})
	);
</script>

<div class="flex w-[440px] flex-col">
	<Filter />

	<div class="mb-2 flex flex-1 flex-col overflow-auto">
		<!-- Playlist -->
		{#each filteredPlaylists as playlist (playlist.id)}
			<PlaylistItem {playlist} />
		{/each}
	</div>
	<!-- VIDEOS -->
	<span class="border border-zinc-800"></span>
	<div class="flex h-48 flex-col overflow-auto pt-2">
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
