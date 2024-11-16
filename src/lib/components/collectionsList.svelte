<script lang="ts">
	import type { Collection } from '$lib/types';

	interface Props {
		selectedCollection: Collection | undefined;
		collections: Collection[];
	}

	let { selectedCollection = $bindable(), collections }: Props = $props();
</script>

<div class="flex w-96 flex-col bg-slate-950 p-2 text-slate-50">
	{#each collections as collection}
		<button
			class={selectedCollection?.id == collection.id
				? 'p1 flex w-full flex-row bg-slate-800'
				: 'p1 flex w-full flex-row'}
			onclick={() => {
				selectedCollection = collection;
			}}
		>
			<!-- Show first video thumbnail -->
			{#if collection.videos}
				<img
					class="w-32"
					src={'http://img.youtube.com/vi/' + collection.videos[0].youtubeId + '/mqdefault.jpg'}
					alt=""
				/>
			{/if}

			<!-- Show video info -->
			<div class="flex flex-1 flex-col pl-2">
				<!-- Title and # of videos -->
				<div class="flex flex-row items-center justify-between">
					<span>{collection.title}</span>
					{#if collection.videos}
						<span class="h-4 w-4 rounded-full bg-sky-800 text-center text-xs"
							>{collection.videos.length}</span
						>
					{/if}
				</div>

				<!-- Artist -->
				<span class="text-left text-sm font-thin">{collection.artist}</span>

				<!-- Tags -->
				<div class="flex flex-row space-x-2">
					{#each collection.tags as tag}
						<div class="rounded-lg bg-sky-800 px-2 text-sm">
							{tag}
						</div>
					{/each}
				</div>
			</div>
		</button>
	{/each}
</div>

<style lang="postcss">
	button:hover {
		@apply bg-slate-800;
	}
</style>
