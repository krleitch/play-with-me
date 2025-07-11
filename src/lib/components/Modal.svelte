<script>
	let { showModal = $bindable(), children, closeable, title } = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (showModal) dialog.showModal();
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	class="rounded-xl bg-zinc-700 text-zinc-100"
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => {
		if (closeable && e.target === dialog) dialog.close();
	}}
>
	<div class="flex flex-col">
		<!-- header -->
		<div class="flex flex-row justify-between bg-zinc-800 p-2">
			<span>{title}</span>
			<button class="cursor-pointer" onclick={() => dialog.close()}>
				<span class="material-symbols-outlined !text-md ml-2 text-zinc-300">close</span>
			</button>
		</div>

		<!-- children -->
		<div class="p-2">
			{@render children?.()}
		</div>
	</div>
</dialog>

<style>
	dialog {
		max-width: 1000px;
		border-radius: 0.2em;
		border: none;
		padding: 0;
		position: fixed;
		left: calc(50% - 500px);
		top: 100px;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
