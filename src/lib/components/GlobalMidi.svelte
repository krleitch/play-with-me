<script lang="ts">
	import type { Video, Playlist, Flag } from '$lib/types';
	import { Genre, Instrument, Tag, Tuning } from '$lib';
	import { Modal, FilterProperty } from '$lib/components';
	import { onMount } from 'svelte';
	import { playlistState } from '$lib';
	import { layoutState, MIDIState } from '$lib';

	let { globalMIDI } = $props();

	function reset() {
		globalMIDI.value = {
			left: -1,
			leftStep: 5,
			right: -1,
			rightStep: 5,
			startStop: -1,
			slow: -1,
			fast: -1,
			volumeUp: -1,
			volumeUpStep: 10,
			volumeDown: -1,
			volumeDownStep: 10,
			prevFlag: -1,
			nextFlag: -1,
			prevNextSecondsBefore: 0,
			restart: -1
		};
	}
</script>

<Modal bind:showModal={layoutState.showGlobalMidi} closeOnClickOutside={true} title={'Global MIDI'}>
	<form class="flex flex-col space-y-2">
		<!-- LEFT and RIGHT -->
		<div class="flex flex-row space-x-2">
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<span class="material-symbols-outlined !text-sm">arrow_left_alt</span>
					<label for="left"> Left </label>
				</div>
				<input id="left" autocomplete="off" type="number" bind:value={globalMIDI.value.left} />
			</div>
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<span class="material-symbols-outlined !text-sm">numbers</span>
					<label for="leftStep"> Left Step </label>
				</div>
				<input
					id="leftStep"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.leftStep}
				/>
			</div>
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<span class="material-symbols-outlined !text-sm">arrow_right_alt</span>
					<label for="right"> Right </label>
				</div>
				<input id="right" autocomplete="off" type="number" bind:value={globalMIDI.value.right} />
			</div>
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<span class="material-symbols-outlined !text-sm">numbers</span>
					<label for="rightStep"> Right Step </label>
				</div>
				<input
					id="rightStep"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.rightStep}
				/>
			</div>
		</div>

		<!--  VOLUME -->
		<div class="flex flex-row space-x-2">
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<span class="material-symbols-outlined !text-sm">volume_down</span>
					<label for="volumeDown"> Volume Down </label>
				</div>
				<input
					id="volumeDown"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.volumeDown}
				/>
			</div>
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<span class="material-symbols-outlined !text-sm">numbers</span>
					<label for="volumeDownStep"> Down Step </label>
				</div>
				<input
					id="volumeDownStep"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.volumeDownStep}
				/>
			</div>
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<span class="material-symbols-outlined !text-sm">volume_up</span>
					<label for="volumeUp"> Volume Up </label>
				</div>
				<input
					id="volumeUp"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.volumeUp}
				/>
			</div>
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<span class="material-symbols-outlined !text-sm">numbers</span>
					<label for="volumeUpStep"> Up Step </label>
				</div>
				<input
					id="volumeUpStep"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.volumeUpStep}
				/>
			</div>
		</div>

		<!-- Restart, Flag -->
		<div class="flex flex-row space-x-2">
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<span class="material-symbols-outlined !text-sm">restart_alt</span>
					<label for="restart"> Restart </label>
				</div>
				<input
					id="restart"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.restart}
				/>
			</div>
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<span class="material-symbols-outlined !text-sm">flag</span>
					<label for="prevFlag"> Prev Flag </label>
				</div>
				<input
					id="prevFlag"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.prevFlag}
				/>
			</div>
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<span class="material-symbols-outlined !text-sm">flag</span>
					<label for="nextFlag"> Next Flag </label>
				</div>
				<input
					id="nextFlag"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.nextFlag}
				/>
			</div>
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<span class="material-symbols-outlined !text-sm">timer</span>
					<label for="prevNextSecondsBefore"> Sec Before </label>
				</div>
				<input
					id="prevNextSecondsBefore"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.prevNextSecondsBefore}
				/>
			</div>
		</div>

		<!-- Start Stop Slow Fast -->
		<div class="flex flex-row space-x-2">
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<span class="material-symbols-outlined !text-sm">play_pause</span>
					<label for="startStop"> Play / Pause </label>
				</div>
				<input
					id="startStop"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.startStop}
				/>
			</div>
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<span class="material-symbols-outlined !text-sm">arrow_cool_down</span>
					<label for="slow"> Slow Playback </label>
				</div>
				<input id="slow" autocomplete="off" type="number" bind:value={globalMIDI.value.slow} />
			</div>
			<div class="flex flex-col">
				<div class="flex flex-row items-center">
					<span class="material-symbols-outlined !text-sm">arrow_warm_up</span>
					<label for="fast"> Fast Playback </label>
				</div>
				<input id="fast" autocomplete="off" type="number" bind:value={globalMIDI.value.fast} />
			</div>
		</div>

		<!-- Buttons -->
		<div class="flex flex-row space-x-2">
			<button class="ml-auto" type="button" onclick={reset}>
				<span class="material-symbols-outlined">restart_alt</span>
				<span>Reset</span>
			</button>
		</div>
	</form>
</Modal>

<style lang="postcss">
	@reference "../../app.css";

	input {
		outline: none;
		border: none;
		min-width: 0;
		width: 100%;
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

	.material-symbols-outlined {
		@apply text-zinc-300;
	}

	label {
		@apply text-zinc-300;
	}

	button {
		@apply flex cursor-pointer flex-row items-center space-x-1;
		@apply rounded-xl bg-zinc-800 px-4 py-2 hover:bg-zinc-700;
	}
	.material-symbols-outlined {
		@apply text-zinc-300;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
