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
		return false;
	};

	let getButtonClass = (value: string): string => {
		return list.indexOf(value) != -1 ? 'selected ' + color : color;
	};
</script>

<div class="flex h-[32px] flex-row items-center">
	<div class="flex h-[32px] flex-row flex-nowrap items-center overflow-hidden {color} px-1 pb-1">
		<span class="material-symbols-outlined !text-md {color}">
			{icon}
		</span>
		<span class="text-md ml-1">{title}</span>
	</div>

	<div class="flex flex-row flex-wrap rounded-br-lg rounded-bl-lg {color} p-1">
		{#each values as value}
			<button type="button" class={getButtonClass(value)} onclick={() => toggleFilter(value)}>
				<span class="text-sm">{value}</span>
			</button>
		{/each}
	</div>
</div>

<style lang="postcss">
	@reference "../../app.css";

	button {
		@apply mr-1 mb-1 flex cursor-pointer items-center justify-center rounded-md bg-zinc-800 px-2 text-white;
	}
	button:hover {
		@apply bg-zinc-700;
	}

	button.selected.red {
		@apply bg-red-900;
	}
	button.selected.blue {
		@apply bg-blue-900;
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
		@apply text-amber-900;
	}
	.material-symbols-outlined.purple {
		@apply text-purple-900;
	}
</style>
