<script lang="ts">
	import type { Playlist, Genre, Instrument, Tag, Flag } from '$lib';
	import { playlistState, youtubeState, timelineState, layoutState } from '$lib';

	type FlagWithPosition = Flag & { position: number };

	// let selectedFlag: FlagWithPosition | undefined = $state();
	let newFlagName: string = $state('');

	let flags: FlagWithPosition[] | undefined = $derived(
		playlistState.selectedVideo?.flags?.map((flag) => {
			return {
				id: flag.id,
				name: flag.name,
				time: flag.time,
				position: (flag.time / timelineState?.timelineLength) * 100,
				seekCC: flag.seekCC,
				sendCC: flag.sendCC,
				sendCCValue: flag.sendCCValue,
				sendPC: flag.sendPC,
				sendPCValue: flag.sendPCValue,
				created: flag.created,
				updated: flag.updated
			};
		})
	);

	let percentComplete = $derived((timelineState.currentTime / timelineState.timelineLength) * 100);

	$effect(() => {
		if (flags) {
			flags.forEach((flag) => {
				if (timelineState.currentTime - timelineState.prevCurrentTime <= 0.2) {
					if (
						timelineState.currentTime >= flag.time &&
						timelineState.prevCurrentTime <= flag.time
					) {
						console.log(flag.name + ' PASSED ');
					}
				}
			});
		}
	});

	function secondsToStringTime(seconds: number) {
		let date = new Date(0);
		date.setSeconds(seconds); // specify value for SECONDS here
		return date.toISOString().substring(11, 19);
	}

	function seek(seconds: number) {
		if (youtubeState.youtubePlayer) {
			youtubeState.youtubePlayer.seekTo(seconds);
		}
	}

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
		}
	}

	async function deleteFlag() {
		if (
			window.confirm('Are you sure you would like to delete this flag?') &&
			playlistState.selectedFlag &&
			playlistState.selectedVideo
		) {
			const response = await fetch('/api/flag', {
				method: 'DELETE',
				body: JSON.stringify({ flagId: playlistState.selectedFlag.id })
			});

			const deleteResponse = await response.json();

			playlistState.selectedVideo.flags = playlistState.selectedVideo.flags.filter(
				(f) => f.id !== playlistState.selectedFlag.id
			);
			playlistState.selectedFlag = undefined;
		} else {
		}
	}
</script>

<div class="flex h-36 flex-col rounded-xl px-[10px] pt-2">
	<!-- NAV -->
	<div class="flex w-full flex-row justify-between">
		<!-- Left -->
		<div class="flex flex-row space-x-2">
			{#if playlistState.selectedFlag}
				<!-- Flag name -->
				<div
					class="flex min-w-64 flex-row items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950"
				>
					<div class="flex flex-row items-center space-x-1 px-2">
						<span class="material-symbols-outlined">flag</span>
						<span>{playlistState.selectedFlag.name}</span>
					</div>
					<!-- Delete -->
					<button
						class="flex cursor-pointer items-center rounded-tr-xl rounded-br-xl bg-zinc-800 px-2 py-2 hover:bg-zinc-700"
						type="button"
						onclick={deleteFlag}
						aria-label="Add Playlist"
					>
						<span class="material-symbols-outlined">delete_forever</span>
					</button>
				</div>
				<!-- Flag time -->
				<div class="flex flex-row items-center rounded-xl border border-zinc-800 bg-zinc-950">
					<div class="flex flex-row items-center space-x-1 px-2">
						<span class="material-symbols-outlined">alarm</span>
						<span>{secondsToStringTime(playlistState.selectedFlag.time)}</span>
					</div>
					<!-- Seek -->
					<button
						type="button"
						onclick={() =>
							playlistState.selectedFlag ? seek(playlistState.selectedFlag.time) : null}
						aria-label="Add Playlist"
						class="flex cursor-pointer items-center rounded-tr-xl rounded-br-xl bg-zinc-800 px-2 py-2 hover:bg-zinc-700"
					>
						<span class="material-symbols-outlined">video_search</span>
					</button>
				</div>
			{/if}
		</div>

		<!-- Right -->
		<div class="flex flex-row space-x-2">
			<!-- Add -->
			<form id="add-flag" onsubmit={onSubmit}>
				<div class="flex flex-row items-center rounded-xl border border-zinc-800 bg-zinc-950">
					<input
						class="w-48 rounded-tl-xl rounded-bl-xl"
						bind:value={newFlagName}
						type="text"
						name="name"
						required
						maxlength="15"
						placeholder="Flag Name..."
					/>
					<button
						class="flex cursor-pointer items-center rounded-tr-xl rounded-br-xl bg-zinc-800 px-2 py-2 hover:bg-zinc-700"
						type="submit"
					>
						<span class="material-symbols-outlined">add_circle</span>
					</button>
				</div>
			</form>
			<!--  MIDI Assign -->
			<button
				class="flex cursor-pointer items-center space-x-1 rounded-xl bg-zinc-800 px-4 py-2 hover:bg-zinc-700"
				type="button"
				onclick={() => {
					layoutState.showMidiAssign = true;
					if (youtubeState.youtubePlayer) {
						youtubeState.youtubePlayer.pauseVideo();
					}
				}}
				aria-label="Add Playlist"
			>
				<span class="material-symbols-outlined">flag_check</span>
				<span>MIDI Assign</span>
			</button>
		</div>
	</div>

	<!-- Timeline -->
	<div class="relative mt-4 flex h-full flex-col justify-between">
		{#if playlistState.selectedVideo}
			{#if flags}
				{#each flags as flag}
					{#if flag.position <= 100}
						<div class="absolute z-100 h-full" style="left: {flag.position}%">
							<div class="h-full border-l-2 border-sky-800">
								<button
									onclick={() => {
										playlistState.selectedFlag = flag;
										seek(flag.time);
									}}
									type="button"
									class="cursor-pointer rounded-tr-md rounded-br-md bg-sky-950 p-2 hover:bg-sky-900"
								>
									<span> {flag.name} </span>
								</button>
							</div>
						</div>
					{/if}
				{/each}
			{/if}
		{/if}
		<!-- {timelineState.currentTime} -->
		<!-- <span> out of </span> -->
		<!-- {timelineState.timelineLength} -->

		<div class="relative mt-auto w-full">
			{#if percentComplete <= 100}
				<div
					class="z-10 h-[15px] bg-gradient-to-r from-rose-800 to-rose-950"
					style="width: {percentComplete}%"
				></div>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "../../app.css";

	input {
		outline: none;
		border: none;
		@apply bg-zinc-950;
	}
	input:focus {
		box-shadow: none;
		outline: none;
		border: none;
	}
	input::placeholder {
		opacity: 0.5;
		@apply text-zinc-300;
	}

	.material-symbols-outlined {
		@apply text-zinc-300;
	}
</style>
