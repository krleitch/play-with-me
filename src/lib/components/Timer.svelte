<script lang="ts">
	import { slide } from 'svelte/transition';
	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import { onMount } from 'svelte';

	let { countdownName, countdownTime, countdownColor } = $props();

	let count = $state(0);
	const times = Array.from({ length: countdownTime - 1 });

	onMount(() => {
		count = countdownTime;

		const interval = setInterval(() => {
			count = Math.max(0, count - 1);
		}, 1000);

		return () => clearInterval(interval);
	});

	function getCountdownClass(): string {
		if (countdownColor == 'red') {
			return 'countdown-red';
		} else if (countdownColor == 'teal-orange') {
			return 'countdown-teal-orange';
		} else if (countdownColor == 'teal') {
			return 'countdown-teal';
		} else if (countdownColor == 'amber') {
			return 'countdown-amber';
		} else if (countdownColor == 'purple') {
			return 'countdown-purple';
		} else {
			return 'countdown-blue';
		}
	}
</script>

<div
	in:fade={{ duration: 500 }}
	out:fade={{ duration: 500 }}
	class="relative m-4 h-24 w-full max-w-full bg-zinc-800"
>
	<div
		class="relative h-full w-full bg-zinc-900"
		in:slide={{ duration: countdownTime * 1000, easing: linear, axis: 'x' }}
	>
		<div class={getCountdownClass()}></div>
	</div>
	<div class="absolute top-0 left-0 flex h-full w-full items-center justify-center">
		<span class="material-symbols-outlined !text-7xl">timer</span>
		<span class="max-w-1/2 overflow-hidden text-7xl text-nowrap text-zinc-100">{countdownName}</span
		>
		<span class="mt-1 ml-4 text-7xl font-bold text-rose-500">{count}</span>
	</div>
	{#each times as _, index}
		<span
			style="left: {Math.floor(((index + 1) / countdownTime) * 100)}%"
			class="absolute bottom-0 h-3 w-1 bg-zinc-950"
		>
		</span>
	{/each}
</div>

<style lang="postcss">
	@reference "../../app.css";

	.countdown-red {
		@apply absolute left-0 box-border h-full w-full border-r-4;
		@apply border-r-rose-500 bg-gradient-to-r from-rose-300 to-rose-400;
	}
	.countdown-teal-orange {
		@apply absolute left-0 box-border h-full w-full border-r-4;
		@apply border-r-rose-500 bg-gradient-to-r from-teal-700 to-amber-900;
	}
	.countdown-teal {
		@apply absolute left-0 box-border h-full w-full border-r-4;
		@apply border-r-rose-500 bg-gradient-to-r from-teal-700 to-teal-900;
	}
	.countdown-amber {
		@apply absolute left-0 box-border h-full w-full border-r-4;
		@apply border-r-rose-500 bg-gradient-to-r from-amber-700 to-amber-900;
	}
	.countdown-purple {
		@apply absolute left-0 box-border h-full w-full border-r-4;
		@apply border-r-rose-500 bg-gradient-to-r from-violet-700 to-violet-900;
	}
	.countdown-blue {
		@apply absolute left-0 box-border h-full w-full border-r-4;
		@apply border-r-rose-500 bg-gradient-to-r from-sky-700 to-sky-900;
	}
</style>
