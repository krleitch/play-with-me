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
			restart: -1
		};
	}
</script>

<Modal bind:showModal={layoutState.showGlobalMidi} closeOnClickOutside={true} title={'Global MIDI'}>
	<form class="flex flex-col space-y-2">
		<!-- LEFT and RIGHT -->
		<div class="flex flex-row space-x-2">
			<div class="flex flex-col">
				<label for="left"> Left </label>
				<input id="left" autocomplete="off" type="number" bind:value={globalMIDI.value.left} />
			</div>
			<div class="flex flex-col">
				<label for="leftStep"> Left Step </label>
				<input
					id="leftStep"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.leftStep}
				/>
			</div>
			<div class="flex flex-col">
				<label for="right"> Right </label>
				<input id="right" autocomplete="off" type="number" bind:value={globalMIDI.value.right} />
			</div>
			<div class="flex flex-col">
				<label for="rightStep"> Right Step </label>
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
				<label for="volumeDown"> Volume Down </label>
				<input
					id="volumeDown"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.volumeDown}
				/>
			</div>
			<div class="flex flex-col">
				<label for="volumeDownStep"> Down Step </label>
				<input
					id="volumeDownStep"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.volumeDownStep}
				/>
			</div>
			<div class="flex flex-col">
				<label for="volumeUp"> Volume Up </label>
				<input
					id="volumeUp"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.volumeUp}
				/>
			</div>
			<div class="flex flex-col">
				<label for="volumeUpStep"> Up Step</label>
				<input
					id="volumeUpStep"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.volumeUpStep}
				/>
			</div>
		</div>

		<!-- Start Stop Slow Fast -->
		<div class="flex flex-row space-x-2">
			<div class="flex flex-col">
				<label for="startStop"> Start / Stop </label>
				<input
					id="startStop"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.startStop}
				/>
			</div>
			<div class="flex flex-col">
				<label for="slow"> Slow Playback </label>
				<input id="slow" autocomplete="off" type="number" bind:value={globalMIDI.value.slow} />
			</div>
			<div class="flex flex-col">
				<label for="fast"> Fast Playback </label>
				<input id="fast" autocomplete="off" type="number" bind:value={globalMIDI.value.fast} />
			</div>
		</div>

		<!-- Restart, Flag -->
		<div class="flex flex-row space-x-2">
			<div class="flex flex-col">
				<label for="restart"> Restart </label>
				<input
					id="restart"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.restart}
				/>
			</div>
			<div class="flex flex-col">
				<label for="prevFlag"> Previous Flag </label>
				<input
					id="prevFlag"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.prevFlag}
				/>
			</div>
			<div class="flex flex-col">
				<label for="nextFlag"> Next Flag </label>
				<input
					id="nextFlag"
					autocomplete="off"
					type="number"
					bind:value={globalMIDI.value.nextFlag}
				/>
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

	label {
		@apply ml-2 text-sm text-zinc-300;
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
