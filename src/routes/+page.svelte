<script lang="ts">
	import type { PageData } from './$types';

	import Collections from '$lib/components/collections.svelte';
	import Video from '$lib/components/video.svelte';
	import Timestamp from '$lib/components/timestamp.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex h-screen flex-row p-2">
	<div class="flex flex-1 flex-col pr-2">
		<Video />
		<Timestamp />
	</div>

	<Collections />
</div>
