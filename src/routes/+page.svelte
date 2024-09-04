<script>
	import { Video, Playlist, Alternates, Notes } from '$lib';
</script>

<div class="flex h-screen w-screen">
	<div class="flex-col">
		<Video />

		<div class="flex">
			<Notes />

			<Alternates />
		</div>
	</div>

	<Playlist />
</div>
