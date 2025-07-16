<script lang="ts">
	import type { Video, Playlist, Flag } from '$lib/types';
	import { Genre, Instrument, Tag, Tuning } from '$lib';
	import { Modal, FilterProperty } from '$lib/components';
	import { onMount } from 'svelte';
	import { playlistState } from '$lib';
	import { layoutState, MIDIState } from '$lib';

	let MIDIInputs: MIDIInput[] = $state([]);
	let MIDIOutputs: MIDIOutput[] = $state([]);

	let flags: Flag[] = $state([]);

	$effect(() => {
		if (playlistState.selectedVideo) {
			flags = playlistState.selectedVideo.flags
				.map((flag) => {
					return { ...flag };
				})
				.sort((a, b) => {
					if (a.time < b.time) {
						return -1;
					} else if (a.time > b.time) {
						return 1;
					} else {
						return 0;
					}
				});
		}
	});

	onMount(async () => {
		window.navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
	});

	function onMIDISuccess(MIDIAccess: MIDIAccess) {
		MIDIAccess.inputs.forEach(function (input) {
			if (!MIDIState.selectedMIDIInput) {
				MIDIState.selectedMIDIInput = input;
			}
			MIDIInputs.push(input);
		});

		MIDIAccess.outputs.forEach(function (output) {
			if (!MIDIState.selectedMIDIOutput) {
				MIDIState.selectedMIDIOutput = output;
			}
			MIDIOutputs.push(output);
		});
	}

	function onMIDIFailure(error: any) {
		console.error('Failed to get MIDI access:', error);
	}

	async function onSubmit(
		event: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
			originalTarget: EventTarget & HTMLFormElement;
		}
	) {
		// Make sure we have something to update
		if (!playlistState.selectedVideo) return;

		let updatedFlags = [];
		// PATCH the old flags
		for (const flag of flags) {
			const data = JSON.stringify({
				flagId: flag.id,
				name: flag.name,
				time: flag.time,
				seekCC: flag.seekCC,
				sendCC: flag.sendCC,
				sendCCValue: flag.sendCCValue,
				sendPC: flag.sendPC
			});

			const flagResponse = await fetch('/api/flag', {
				method: 'PATCH',
				body: data
			});

			const updatedFlag: Flag = await flagResponse.json();
			updatedFlags.push(updatedFlag);
		}

		playlistState.selectedVideo.flags = updatedFlags;
		playlistState.selectedFlag = undefined;

		layoutState.showMidiAssign = false;
	}
</script>

<Modal
	bind:showModal={layoutState.showMidiAssign}
	closeOnClickOutside={false}
	title={'MIDI Assign'}
>
	<div class="flex flex-col">
		<div class="flex flex-row space-x-2">
			<div class="flex flex-1 flex-col">
				<label for="midi-input">MIDI Input Device</label>
				<select bind:value={MIDIState.selectedMIDIInput} name="input" id="midi-input">
					{#each MIDIInputs as input}
						<option value={input}>{input.name}</option>
					{/each}
				</select>
			</div>

			<div class="flex flex-1 flex-col">
				<label for="midi-output">MIDI Output Device</label>
				<select bind:value={MIDIState.selectedMIDIOutput} name="output" id="midi-output">
					{#each MIDIOutputs as output}
						<option value={output}>{output.name}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="my-2 ml-1 flex flex-row items-center">
			<span class="material-symbols-outlined">flag</span>
			<span class="ml-1">Flags</span>
		</div>

		<form onsubmit={onSubmit}>
			<div class="flex max-h-[415px] flex-col space-y-1 overflow-auto">
				{#if flags.length >= 1}
					{#each flags as flag, index}
						<div class="mb-4 flex flex-col">
							<!-- Name and time -->
							<div class="flex flex-row items-center space-x-2">
								<input
									bind:value={flag.name}
									autocomplete="off"
									type="text"
									required
									placeholder="Flag Name..."
									class="w-1/2"
								/>
								<input
									bind:value={flag.time}
									autocomplete="off"
									type="number"
									step="any"
									required
									placeholder="Time..."
									class="w-1/2"
								/>
							</div>
							<!-- CC and PC and SEEK -->
							<div class="mt-1 flex flex-row items-center space-x-2">
								<div class="flex w-[80px] flex-col">
									<label for="seekCC">Seek CC#</label>
									<input
										id="seekCC"
										bind:value={flag.seekCC}
										autocomplete="off"
										type="number"
										required
										placeholder="Seek CC"
									/>
								</div>
								<div class="flex w-[80px] flex-col">
									<label for="sendCC">Send CC#</label>
									<input
										id="sendCC"
										bind:value={flag.sendCC}
										autocomplete="off"
										type="number"
										required
										placeholder="Send CC"
									/>
								</div>
								<div class="flex w-[80px] flex-col">
									<label for="sendCCValue">CC Value</label>
									<input
										id="sendCCValue"
										bind:value={flag.sendCCValue}
										autocomplete="off"
										type="number"
										required
										placeholder="CC Value"
									/>
								</div>
								<div class="flex w-[80px] flex-col">
									<label for="sendPC">Send PC#</label>
									<input
										id="sendPC"
										bind:value={flag.sendPC}
										autocomplete="off"
										type="number"
										required
										placeholder="Send PC"
									/>
								</div>
							</div>
						</div>
					{/each}
				{:else}
					<div class="ml-2 text-sm text-zinc-300">No Flags to display</div>
				{/if}
			</div>
			<!-- Buttons -->
			<div class="mt-4 flex flex-row space-x-2">
				<button class="ml-auto" type="submit">
					<span class="material-symbols-outlined">save</span>
					<span>Save Flags</span>
				</button>
			</div>
		</form>
	</div>
</Modal>

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

	label {
		@apply ml-2 text-sm text-zinc-300;
	}

	select {
		outline: none;
		@apply rounded-xl border-zinc-800 bg-zinc-950 text-zinc-100;
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
