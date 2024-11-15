<script lang="ts">
  import type { Collection } from '$lib/types';

	import Collections from '$lib/components/collections.svelte';
	import Video from '$lib/components/video.svelte';
	import Timestamp from '$lib/components/timestamp.svelte';

  export let data: {collections: Collection[] }

</script>

<div class="flex h-screen flex-row p-2">
	<div class="flex flex-1 flex-col pr-2">
		<Video />
		<Timestamp />
	</div>

	<Collections collections={data.collections}/>
</div>
