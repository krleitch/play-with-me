<script>
	import { Video, Playlist, Alternates, Notes } from '$lib';
</script>

<div class="flex h-full p-4">
	<div class="flex-col mr-4">
		<Video />

		<div class="flex grow mt-4">
			<Notes />

			<Alternates />
		</div>
	</div>

	<Playlist />
</div>
