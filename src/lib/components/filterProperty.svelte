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
		let selected = list.indexOf(value) != -1 ? 'selected ' + color : color;
		return selected;
	};
</script>

<div class="flex flex-col">
	<div class="flex w-36 flex-none flex-row items-center rounded-tl-lg rounded-tr-lg {color} px-1">
		<ion-icon class="text-sm {color}" name={icon}></ion-icon>
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
		@apply text-black;
		@apply bg-gray-100;
		@apply mr-1;
		@apply mb-1;
		@apply px-2;
	}

	button.selected {
	}

	button.selected.red {
		@apply bg-red-400;
	}
	button.selected.blue {
		@apply bg-blue-400;
	}
	button.selected.amber {
		@apply bg-amber-400;
	}
	button.selected.purple {
		@apply bg-purple-400;
	}
	ion-icon.red {
		@apply text-red-300;
	}
	ion-icon.blue {
		@apply text-blue-300;
	}
	ion-icon.amber {
		@apply text-amber-300;
	}
	ion-icon.purple {
		@apply text-purple-300;
	}
</style>
