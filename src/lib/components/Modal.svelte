<script>
	let { showModal = $bindable(), children, closeOnClickOutside, title } = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (showModal) {
			dialog.showModal();
			document.body.classList.add('overflow-y-hidden');
		} else {
			dialog.close();
			document.body.classList.remove('overflow-y-hidden');
		}
	});
</script>

<dialog
	class="rounded-xl bg-zinc-950 text-zinc-100"
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => {
		if (closeOnClickOutside && e.target === dialog) dialog.close();
	}}
>
	<div class="flex flex-col rounded-xl">
		<!-- header -->
		<div
			class=" flex flex-row items-center justify-between rounded-tl-xl rounded-tr-xl bg-zinc-800 px-4 py-2"
		>
			<span>{title}</span>
			<button class="flex cursor-pointer" onclick={() => dialog.close()}>
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
		width: 500px;
		border-radius: 0.2em;
		border: none;
		padding: 0;
		position: fixed;
		left: calc(50% - 250px);
		top: 100px;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
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
