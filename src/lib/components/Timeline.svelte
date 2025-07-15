<script lang="ts">
	import type { Playlist, Genre, Instrument, Tag, Flag } from '$lib';
	import { playlistState, youtubeState, timelineState } from '$lib';

	type FlagWithPosition = Flag & { position: number };

	let selectedFlag: FlagWithPosition | undefined = $state();
	let newFlagName: string = $state('');

	let flags: FlagWithPosition[] | undefined = $derived(
		playlistState.selectedVideo?.flags?.map((flag) => {
			return {
				id: flag.id,
				name: flag.name,
				time: flag.time,
				position: (flag.time / timelineState?.timelineLength) * 100,
				seekMidi: flag.seekMidi,
				sendMidi: flag.sendMidi,
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
			selectedFlag &&
			playlistState.selectedVideo
		) {
			const response = await fetch('/api/flag', {
				method: 'DELETE',
				body: JSON.stringify({ flagId: selectedFlag.id })
			});

			const deleteResponse = await response.json();

			playlistState.selectedVideo.flags = playlistState.selectedVideo.flags.filter(
				(f) => f.id !== selectedFlag.id
			);
			selectedFlag = undefined;
		} else {
		}
	}
</script>

<div class="flex h-48 flex-col rounded-xl px-[10px] pt-2">
	<!-- NAV -->
	<div class="flex w-full flex-row justify-between">
		<!-- Left -->
		<div class="flex flex-row space-x-2">
			{#if selectedFlag}
				<!-- Flag name -->
				<div
					class="flex min-w-64 flex-row items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950"
				>
					<div class="flex flex-row items-center space-x-1 px-2">
						<span class="material-symbols-outlined">flag</span>
						<span>{selectedFlag.name}</span>
					</div>
					<!-- Delete -->
					<button
						class="!rounded-tl-none !rounded-bl-none !px-2"
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
						<span>{secondsToStringTime(selectedFlag.time)}</span>
					</div>
					<!-- Seek -->
					<button
						type="button"
						onclick={() => (selectedFlag ? seek(selectedFlag.time) : null)}
						aria-label="Add Playlist"
						class="!rounded-tl-none !rounded-bl-none !px-2"
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
						placeholder="Flag Name..."
					/>
					<button type="submit" class="!rounded-tl-none !rounded-bl-none !px-2">
						<span class="material-symbols-outlined">add_circle</span>
					</button>
				</div>
			</form>
			<!-- Flag Assign -->
			<button type="button" onclick={() => null} aria-label="Add Playlist">
				<span class="material-symbols-outlined">flag_check</span>
				<span> Flag Assign </span>
			</button>
		</div>
	</div>

	<!-- Timeline -->
	<div class="relative mt-4 flex h-full flex-col justify-between">
		{#if playlistState.selectedVideo}
			{#if flags}
				{#each flags as flag}
					{#if flag.position <= 100}
						<div class="absolute h-full" style="left: {flag.position}%">
							<div class="z-100 h-full border-l-2 border-blue-400">
								<button
									onclick={() => (selectedFlag = flag)}
									type="button"
									class="!rounded-none !bg-blue-400 p-2"
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

		<div id="myProgress">
			{#if percentComplete <= 100}
				<!-- <span>{percentComplete}%</span> -->
				<div id="myBar" style="width: {percentComplete}%"></div>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "../../app.css";

	#myProgress {
		width: 100%;
		height: 30px;
		position: relative;
		margin-top: auto;
	}

	#myBar {
		height: 30px;
		background-color: hsl(102, 27%, 60%);
		border: 1px solid #333;
		z-index: 10;
	}

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

	button {
		@apply flex cursor-pointer flex-row items-center space-x-1;
		@apply rounded-xl bg-zinc-800 px-4 py-2 hover:bg-zinc-700;
	}

	.material-symbols-outlined {
		@apply text-zinc-300;
	}
</style>
