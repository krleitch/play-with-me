<script lang="ts">
	import { playlistState } from '$lib';
	import type { Note } from '$lib/types';

	let noteTitle: string = $state('');

	let fontSize = $state(3);

	async function deleteNote(noteId: string) {
		if (window.confirm('Are you sure you would like to delete this note?')) {
			const response = await fetch('/api/note', {
				method: 'DELETE',
				body: JSON.stringify({ noteId: noteId })
			});

			if (playlistState.selectedPlaylist) {
				playlistState.selectedPlaylist.notes = playlistState.selectedPlaylist.notes.filter(
					(n) => n.id !== noteId
				);
			}
		}
	}

	function bold() {
		document.execCommand('bold', false, undefined);
	}
	function italic() {
		document.execCommand('italic', false, undefined);
	}
	function underline() {
		document.execCommand('underline', false, undefined);
	}
	function decrease() {
		fontSize = Math.max(1, fontSize - 1);
		document.execCommand('fontSize', false, fontSize.toString());
	}
	function increase() {
		fontSize += 1;
		document.execCommand('fontSize', false, fontSize.toString());
	}

	async function onSubmit(
		event: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
			originalTarget: EventTarget & HTMLFormElement;
		}
	) {
		if (playlistState.selectedPlaylist) {
			let content = document.getElementById('content');

			if (content && content.innerText.length > 0) {
				let message = content.innerHTML;

				const noteResponse = await fetch('/api/note', {
					method: 'POST',
					body: JSON.stringify({
						message: message,
						title: noteTitle,
						playlistId: playlistState.selectedPlaylist.id
					})
				});

				const createdNote: Note = await noteResponse.json();

				playlistState.selectedPlaylist.notes.push(createdNote);

				event.originalTarget.reset();
				content.innerHTML = '';
			}
		}
	}
</script>

<div class="flex w-[400px] flex-col">
	{#if playlistState.selectedPlaylist}
		<div class="flex-1 space-y-2 overflow-auto">
			{#if playlistState.selectedPlaylist}
				{#each playlistState.selectedPlaylist.notes as note, index}
					<div class="flex flex-col">
						<div
							class="flex flex-row items-center justify-between rounded-tl-xl rounded-tr-xl bg-zinc-800 px-4 py-2"
						>
							<span>{note.title}</span>
							<button type="button" class="flex cursor-pointer" onclick={() => deleteNote(note.id)}>
								<span class="material-symbols-outlined !text-md ml-2 text-zinc-300">close</span>
							</button>
						</div>
						<div class="rounded-br-xl rounded-bl-xl border-1 border-zinc-800 p-4">
							{@html note.message}
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<div class="mt-2 flex flex-col space-y-2">
			<div class="flex flex-col rounded-xl border-1 border-zinc-800">
				<div class="flex flex-row border-b-1 border-b-zinc-800">
					<button
						class="flex cursor-pointer items-center rounded-tl-xl border-r-1 border-r-zinc-800 p-1 hover:bg-zinc-800"
						onclick={bold}
					>
						<span class="material-symbols-outlined">format_bold</span>
					</button>

					<button
						class="flex cursor-pointer items-center border-r-1 border-r-zinc-800 p-1 hover:bg-zinc-800"
						onclick={italic}
					>
						<span class="material-symbols-outlined">format_italic</span>
					</button>
					<button
						class="flex cursor-pointer items-center border-r-1 border-r-zinc-800 p-1 hover:bg-zinc-800"
						onclick={underline}
					>
						<span class="material-symbols-outlined">format_underlined</span>
					</button>
					<button
						class="flex cursor-pointer items-center border-r-1 border-r-zinc-800 p-1 hover:bg-zinc-800"
						onclick={decrease}
					>
						<span class="material-symbols-outlined">text_decrease</span>
					</button>
					<button
						class="flex cursor-pointer items-center border-r-1 border-r-zinc-800 p-1 hover:bg-zinc-800"
						onclick={increase}
					>
						<span class="material-symbols-outlined">text_increase</span>
					</button>
				</div>
				<div class="p-4">
					<div id="content" class="min-h-20" contenteditable></div>
				</div>
			</div>
			<form id="create-note" onsubmit={onSubmit}>
				<div class="flex flex-row space-x-2">
					<input
						bind:value={noteTitle}
						class="flex-1"
						autocomplete="off"
						name="title"
						type="text"
						placeholder="Title..."
					/>
					<button
						type="submit"
						class="flex cursor-pointer flex-row items-center space-x-1 rounded-xl bg-zinc-800 px-2 py-2 hover:bg-zinc-700"
					>
						<span class="material-symbols-outlined">add_circle</span>
						<span>Create Note</span>
					</button>
				</div>
			</form>
		</div>
	{:else}
		<div class="mt-12 flex flex-row justify-center text-sm text-zinc-300">
			Select a playlist to start adding notes.
		</div>
	{/if}
</div>

<style lang="postcss">
	@reference "../../app.css";

	input {
		outline: none;
		border: none;
		@apply rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100;
	}
	input:focus {
		box-shadow: none;
		outline: none;
	}
	input::placeholder {
		opacity: 0.5;
		@apply text-zinc-300;
	}

	[contenteditable]:focus {
		outline: 0px solid transparent;
	}

	.material-symbols-outlined {
		@apply text-zinc-300;
	}
</style>
