<script lang="ts">
	import type { Playlist, Genre, Instrument, Tag, Flag } from '$lib';
	import { playlistState, youtubeState, timelineState, layoutState, MIDIState } from '$lib';

	type FlagWithPosition = Flag & { position: number };

	let { globalMIDI } = $props();

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
				created: flag.created,
				updated: flag.updated
			};
		})
	);

	let percentComplete = $derived((timelineState.currentTime / timelineState.timelineLength) * 100);

	// CHECK FLAGS
	$effect(() => {
		if (flags) {
			flags.forEach((flag) => {
				if (timelineState.currentTime - timelineState.prevCurrentTime <= 0.2) {
					if (
						timelineState.currentTime >= flag.time &&
						timelineState.prevCurrentTime <= flag.time
					) {
						// WE HIT A FLAG, send PC then CC if exist
						if (MIDIState.selectedMIDIOutput && playlistState.selectedVideo) {
							if (flag.sendPC >= 0) {
								const pcMessage = [0xc0, flag.sendPC];
								MIDIState.selectedMIDIOutput.send(pcMessage);
							}
							if (flag.sendCC >= 0 && flag.sendCCValue >= 0) {
								const ccMessage = [0xb0, flag.sendCC, flag.sendCCValue];
								MIDIState.selectedMIDIOutput.send(ccMessage);
							}
						}
					}
				}
			});
		}
	});

	// MIDI INPUT
	$effect(() => {
		if (MIDIState.selectedMIDIInput) {
			MIDIState.selectedMIDIInput.onmidimessage = (message) => {
				if (message?.data && message.data.length > 0) {
					let command = message.data[0];
					let number = message.data[1];
					let value = message.data[2];

					// CC MSG
					if (command == 176 && playlistState.selectedVideo && youtubeState.youtubePlayer) {
						// Search Flags first
						let flagFound = false;
						playlistState.selectedVideo.flags.forEach((flag) => {
							if (flag.seekCC == number && youtubeState.youtubePlayer) {
								youtubeState.youtubePlayer.seekTo(flag.time);
								flagFound = true;
							}
						});

						// CHECK GLOBAL MIDI
						if (!flagFound) {
							switch (number) {
								case globalMIDI.value.prevFlag:
									let currentTimePrev;
									// check if ended
									if (youtubeState.youtubePlayer.getPlayerState() == 0) {
										currentTimePrev = youtubeState.youtubePlayer.getDuration();
									} else {
										currentTimePrev = youtubeState.youtubePlayer.getCurrentTime();
									}

									const prevFlags = flags
										?.filter((flag) => flag.time < currentTimePrev - 1) // give 1 second grace
										.sort((a, b) => {
											if (a.time < b.time) {
												return -1;
											} else if (a.time > b.time) {
												return 1;
											} else {
												return 0;
											}
										});
									if (prevFlags && prevFlags.length > 0) {
										const lastFlag = prevFlags.at(-1);
										if (lastFlag) {
											youtubeState.youtubePlayer.seekTo(lastFlag.time);
										}
									} else {
										youtubeState.youtubePlayer.seekTo(0);
									}
									break;
								case globalMIDI.value.nextFlag:
									const currentTimeNext = youtubeState.youtubePlayer.getCurrentTime();
									const nextFlags = flags
										?.filter((flag) => flag.time > currentTimeNext)
										.sort((a, b) => {
											if (a.time < b.time) {
												return -1;
											} else if (a.time > b.time) {
												return 1;
											} else {
												return 0;
											}
										});
									if (nextFlags && nextFlags.length > 0) {
										const firstFlag = nextFlags.at(0);
										if (firstFlag) {
											youtubeState.youtubePlayer.seekTo(firstFlag.time);
										}
									} else {
										const durationNext = youtubeState.youtubePlayer.getDuration();
										youtubeState.youtubePlayer.seekTo(durationNext - 0.2);
									}
									break;
								case globalMIDI.value.startStop:
									const state = youtubeState.youtubePlayer.getPlayerState();
									if (state == 1) {
										youtubeState.youtubePlayer.pauseVideo();
									} else {
										youtubeState.youtubePlayer.playVideo();
									}
									break;
								case globalMIDI.value.left:
									const currentTimeLeft = youtubeState.youtubePlayer.getCurrentTime();
									const newTimeLeft = Math.max(0, currentTimeLeft - globalMIDI.value.leftStep);
									youtubeState.youtubePlayer.seekTo(newTimeLeft);
									break;
								case globalMIDI.value.right:
									const currentTimeRight = youtubeState.youtubePlayer.getCurrentTime();
									const durationRight = youtubeState.youtubePlayer.getDuration();
									const newTimeRight = Math.min(
										durationRight,
										currentTimeRight + globalMIDI.value.rightStep
									);
									youtubeState.youtubePlayer.seekTo(newTimeRight);
									break;
								case globalMIDI.value.volumeDown:
									const currentVolumeDown = youtubeState.youtubePlayer.getVolume();
									const newVolumeDown = Math.max(
										0,
										currentVolumeDown - globalMIDI.value.volumeDownStep
									);
									youtubeState.youtubePlayer.setVolume(newVolumeDown);
									break;
								case globalMIDI.value.volumeUp:
									const currentVolumeUp = youtubeState.youtubePlayer.getVolume();
									const newVolumeUp = Math.min(
										100,
										currentVolumeUp + globalMIDI.value.volumeUpStep
									);
									youtubeState.youtubePlayer.setVolume(newVolumeUp);
									break;
								case globalMIDI.value.slow:
									const currentPlaybackSlow = youtubeState.youtubePlayer.getPlaybackRate();
									const newPlaybackSlow = Math.max(0, currentPlaybackSlow - 0.25);
									youtubeState.youtubePlayer.setPlaybackRate(newPlaybackSlow);
									break;
								case globalMIDI.value.fast:
									const currentPlaybackFast = youtubeState.youtubePlayer.getPlaybackRate();
									const newPlaybackFast = Math.min(2, currentPlaybackFast + 0.25);
									youtubeState.youtubePlayer.setPlaybackRate(newPlaybackFast);
									break;
								case globalMIDI.value.restart:
									youtubeState.youtubePlayer.seekTo(0);
									break;
							}
						}
					}
				}
			};
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
		<div class="mr-2 flex flex-1 flex-row space-x-2">
			{#if playlistState.selectedFlag}
				<!-- Flag name -->
				<div
					class="flex max-h-[40px] max-w-64 flex-1 flex-row items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950"
				>
					<div class="flex flex-row items-center space-x-1 overflow-hidden px-2 text-nowrap">
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
				<div
					class="flex max-h-[40px] flex-row items-center rounded-xl border border-zinc-800 bg-zinc-950"
				>
					<div class="flex flex-row items-center space-x-1 overflow-hidden px-2 text-nowrap">
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
				class="flex max-h-[40px] cursor-pointer items-center space-x-1 rounded-xl bg-zinc-800 px-4 py-2 text-nowrap hover:bg-zinc-700"
				type="button"
				onclick={() => {
					layoutState.showMidiAssign = true;
					if (youtubeState.youtubePlayer) {
						youtubeState.youtubePlayer.pauseVideo();
					}
				}}
				aria-label="Add Playlist"
			>
				<span class="material-symbols-outlined">piano</span>
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
										// seek(flag.time);
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
