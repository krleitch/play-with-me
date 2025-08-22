<script lang="ts">
	import type { Flag } from '$lib/types';
	import { Modal } from '$lib/components';
	import { layoutState, playlistState, youtubeState } from '$lib';

	async function onSubmit(
		event: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
			originalTarget: EventTarget & HTMLFormElement;
		}
	) {
		const formData = new FormData(event.currentTarget);

		if (youtubeState.youtubePlayer && playlistState.selectedVideo) {
			let seconds = youtubeState.youtubePlayer.getCurrentTime();

			formData.set('time', seconds.toString());
			formData.set('videoId', playlistState.selectedVideo.id);

			const flagResponse = await fetch('/api/flag', {
				method: 'POST',
				body: formData
			});

			const createdFlag: Flag = await flagResponse.json();

			playlistState.selectedVideo.flags.push(createdFlag);

			event.originalTarget.reset();

			layoutState.showAddFlag = false;
		}
	}
</script>

<Modal bind:showModal={layoutState.showAddFlag} closeOnClickOutside={true} title={'Add Flag'}>
	<form onsubmit={onSubmit}>
		<div class="flex max-h-[565px] flex-col space-y-1 overflow-auto"></div>
		<input
			id="name"
			name="name"
			autocomplete="off"
			type="text"
			autofocus
			required
			placeholder="Flag Name..."
		/>
		<!-- Button -->
		<div class="mx-2 mt-4 mb-2 flex flex-row items-center justify-end space-x-2">
			<button class="" type="submit">
				<span class="material-symbols-outlined">flag_check</span>
				<span>Add Flag</span>
			</button>
		</div>
	</form>
</Modal>

<style lang="postcss">
	@reference "../../app.css";

	button {
		@apply flex cursor-pointer flex-row items-center space-x-1;
		@apply rounded-xl bg-zinc-800 px-4 py-2 hover:bg-zinc-700;
	}
	.material-symbols-outlined {
		@apply text-zinc-300;
	}

	input {
		outline: none;
		min-width: 0;
		width: 100%;
		@apply mt-2 rounded-xl border-2 border-zinc-800 bg-zinc-950;
	}
	input:focus {
		box-shadow: none;
		outline: none;
	}
	input::placeholder {
		opacity: 0.5;
		@apply text-zinc-300;
	}
</style>
