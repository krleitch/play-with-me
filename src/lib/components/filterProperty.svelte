<script lang="ts">
	interface Props {
		list: string[];
		title: string;
		icon: string;
		color: string;
		values: string[];
	}
	let { list = $bindable(), title, icon, color, values }: Props = $props();

	let toggleFilter = (value: string) => {
		let found = list.indexOf(value);
		if (found == -1) {
			list.push(value);
		} else {
			list.splice(found, 1);
		}
	};

	let getButtonClass = (value: string): string => {
		return list.indexOf(value) != -1 ? 'selected ' + color : color;
	};
</script>

<div class="flex flex-col">
	<div class="flex w-36 flex-none flex-row items-center rounded-tl-lg rounded-tr-lg {color} px-1">
		<span class="material-symbols-outlined !text-sm {color}">
			{icon}
		</span>
		<span class="text-md ml-1">{title}</span>
	</div>

	<div class="flex flex-row flex-wrap rounded-bl-lg rounded-br-lg {color} p-1">
		{#each values as value}
			<button class={getButtonClass(value)} onclick={() => toggleFilter(value)}>
				<span class="text-sm">{value}</span>
			</button>
		{/each}
	</div>
</div>

<style lang="postcss">
	button {
		@apply rounded-md;
		@apply text-white;
		@apply bg-gray-700;
		@apply mr-1;
		@apply mb-1;
		@apply px-2;
	}
	button:hover {
		@apply bg-gray-600;
	}

	button.selected.red {
		@apply bg-red-950;
	}
	button.selected.blue {
		@apply bg-blue-950;
	}
	button.selected.amber {
		@apply bg-amber-900;
	}
	button.selected.purple {
		@apply bg-purple-900;
	}
	.material-symbols-outlined.red {
		@apply text-red-900;
	}
	.material-symbols-outlined.blue {
		@apply text-blue-900;
	}
	.material-symbols-outlined.amber {
		@apply text-amber-800;
	}
	.material-symbols-outlined.purple {
		@apply text-purple-800;
	}
</style>
