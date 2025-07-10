<script lang="ts">
	import type { Playlist } from '$lib';

	import { Nav, Library, VideoPlayer, Timeline } from '$lib/components';

	let { data }: { data: { playlists: Playlist[] } } = $props();
</script>

<div class="font-roboto h-screen bg-zinc-900 text-zinc-100">
	<Nav />

	<div class="flex flex-row px-8 pb-8">
		<div class="mr-2 flex flex-1 flex-col space-y-2">
			<VideoPlayer />
			<Timeline />
		</div>

		<Library playlists={data.playlists} />
	</div>
</div>
