<script lang="ts">
	import type { Flag } from '$lib';
	import { fade } from 'svelte/transition';
	import { Timer } from '$lib/components';
	import { playlistState, youtubeState, timelineState, layoutState, MIDIState } from '$lib';

	let { globalMIDI } = $props();

	let recentMicroTime = $state(false);
	let recentMicroInterval: number;
	let MIDISubmitSuccess = $state(false);
	let countdownInterval: number | undefined = undefined;
	let countdownDefaultBase: number = $state(5);
	let countdownName: string = $state('');
	let countdownTime: number = $state(5);
	let countdownColor: 'red' | 'blue' | 'purple' | 'amber' | 'teal' | 'teal-orange' = $state('blue');

	let percentComplete = $derived((timelineState.currentTime / timelineState.timelineLength) * 100);

	function toggleDisableFlag(flag: Flag | undefined) {
		if (flag) {
			// const disableResponse = fetch('/api/flag/disabled', {
			// 	method: 'PATCH',
			// 	body: JSON.stringify({ flagId: flag.id, disabled: !flag.disabled })
			// });

			if (playlistState.selectedFlag) {
				playlistState.selectedFlag.disabled = !flag.disabled;
			}
		}
	}
	function toggleShowCountdown(flag: Flag | undefined) {
		if (flag) {
			// const toggleResponse = fetch('/api/flag/showCountdown', {
			// 	method: 'PATCH',
			// 	body: JSON.stringify({ flagId: flag.id, showCountdown: !flag.showCountdown })
			// });

			if (playlistState.selectedFlag) {
				playlistState.selectedFlag.showCountdown = !flag.showCountdown;
			}
		}
	}

	function clickFlagText(flag: Flag) {
		if (playlistState.selectedVideo) {
			if (flag.sendPC >= 0 || (flag.sendCC >= 0 && flag.sendCCValue >= 0)) {
				if (MIDIState.selectedMIDIOutput) {
					if (flag.sendPC >= 0) {
						const pcMessage = [0xc0, flag.sendPC];
						MIDIState.selectedMIDIOutput.send(pcMessage);
					}
					if (flag.sendCC >= 0 && flag.sendCCValue >= 0) {
						const ccMessage = [0xb0, flag.sendCC, flag.sendCCValue];
						MIDIState.selectedMIDIOutput.send(ccMessage);
					}
				}
			} else {
				if (youtubeState.youtubePlayer) {
					// const newTime = Math.max(0, flag.time - flag.seekSecondsBefore);
					layoutState.showCountdown = false;
					if (countdownInterval) {
						clearInterval(countdownInterval);
					}
					youtubeState.youtubePlayer.seekTo(flag.time);
				}
			}
		}
	}

	// CHECK FLAGS
	$effect(() => {
		if (playlistState.selectedVideo?.flags) {
			playlistState.selectedVideo.flags.forEach((flag) => {
				if (timelineState.currentTime - timelineState.prevCurrentTime <= 0.2) {
					let baseCountdown = Math.min(countdownDefaultBase, Math.floor(flag.time));

					if (flag.showCountdown && baseCountdown >= 1) {
						if (
							timelineState.currentTime >= flag.time - baseCountdown &&
							timelineState.prevCurrentTime <= flag.time - baseCountdown
						) {
							// WE ARE GOING TO HIT A FLAG SOON
							if (countdownInterval) {
								clearInterval(countdownInterval);
							}

							countdownTime = baseCountdown;
							countdownDefaultBase = 5; // reset the base if it was changed from a seek
							countdownName = flag.name;

							if (flag.disabled) {
								countdownColor = 'red';
							} else if (flag.sendPC >= 0 && flag.sendCC >= 0 && flag.sendCCValue >= 0) {
								countdownColor = 'teal-orange';
							} else if (flag.sendPC >= 0) {
								countdownColor = 'teal';
							} else if (flag.sendCC >= 0 && flag.sendCCValue >= 0) {
								countdownColor = 'amber';
							} else if (flag.seekCC >= 0) {
								countdownColor = 'purple';
							} else {
								countdownColor = 'blue';
							}

							layoutState.showCountdown = true;
							countdownInterval = setTimeout(
								() => {
									layoutState.showCountdown = false;
								},
								(baseCountdown + 1) * 1000
							);
						}
					}

					if (
						timelineState.currentTime >= flag.time &&
						timelineState.prevCurrentTime <= flag.time
					) {
						// WE HIT A FLAG, send PC then CC if exist
						playlistState.selectedFlag = flag;
						if (
							MIDIState.selectedMIDIOutput &&
							playlistState.selectedVideo &&
							!MIDIState.disableMIDI &&
							!flag.disabled
						) {
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
					if (
						command == 176 &&
						playlistState.selectedVideo &&
						youtubeState.youtubePlayer &&
						!MIDIState.disableMIDI
					) {
						MIDIState.lastCCMessage = number;
						MIDIState.lastCCMessageValue = value;

						// Search Flags first
						let flagFound = false;
						playlistState.selectedVideo.flags.forEach((flag) => {
							if (flag.seekCC == number && youtubeState.youtubePlayer && !flag.disabled) {
								const newTime = Math.max(0, flag.time - flag.seekSecondsBefore);
								layoutState.showCountdown = false;
								if (countdownInterval) {
									clearInterval(countdownInterval);
								}
								youtubeState.youtubePlayer.seekTo(newTime);
								if (flag.seekSecondsBefore > 1 && flag.showCountdown) {
									countdownDefaultBase = Math.min(5, Math.floor(flag.seekSecondsBefore - 1));
								}
								flagFound = true;
							}
						});

						// CHECK GLOBAL MIDI
						if (!flagFound) {
							switch (number) {
								case globalMIDI.value.addFlag:
									midiAddFlag('Flag');
									break;
								case globalMIDI.value.prevFlag:
									let currentTimePrev;
									// check if ended
									if (youtubeState.youtubePlayer.getPlayerState() == 0) {
										currentTimePrev = youtubeState.youtubePlayer.getDuration();
									} else {
										currentTimePrev = youtubeState.youtubePlayer.getCurrentTime();
									}

									const prevFlags = playlistState.selectedVideo.flags
										?.filter((flag) => flag.time < currentTimePrev - 1 && !flag.disabled) // give 1 second grace
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
											const lastBefore =
												globalMIDI.value.prevNextSecondsBefore >= 0
													? globalMIDI.value.prevNextSecondsBefore
													: lastFlag.seekSecondsBefore;
											const prevNewTime = Math.max(0, lastFlag.time - lastBefore);
											layoutState.showCountdown = false;
											if (countdownInterval) {
												clearInterval(countdownInterval);
											}
											youtubeState.youtubePlayer.seekTo(prevNewTime);

											const newDefaultCountdown =
												globalMIDI.value.prevNextSecondsBefore >= 0
													? globalMIDI.value.prevNextSecondsBefore
													: lastFlag.seekSecondsBefore;
											if (newDefaultCountdown > 1 && lastFlag.showCountdown) {
												countdownDefaultBase = Math.min(5, Math.floor(newDefaultCountdown - 1));
											}
										}
									} else {
										layoutState.showCountdown = false;
										if (countdownInterval) {
											clearInterval(countdownInterval);
										}
										youtubeState.youtubePlayer.seekTo(0);
									}
									break;
								case globalMIDI.value.nextFlag:
									const currentTimeNext = youtubeState.youtubePlayer.getCurrentTime();
									const nextFlags = playlistState.selectedVideo.flags
										?.filter((flag) => flag.time > currentTimeNext && !flag.disabled)
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
											const nextBefore =
												globalMIDI.value.prevNextSecondsBefore >= 0
													? globalMIDI.value.prevNextSecondsBefore
													: firstFlag.seekSecondsBefore;
											// const nextBefore = 0;
											if (currentTimeNext >= firstFlag.time - nextBefore) {
												// go to the second flag
												if (nextFlags.length > 1) {
													const secondFlag = nextFlags.at(1);
													if (secondFlag) {
														const nextBeforeSecond =
															globalMIDI.value.prevNextSecondsBefore >= 0
																? globalMIDI.value.prevNextSecondsBefore
																: secondFlag.seekSecondsBefore;
														const nextNewTimeSecond = Math.max(
															0,
															secondFlag.time - nextBeforeSecond
														);
														layoutState.showCountdown = false;
														if (countdownInterval) {
															clearInterval(countdownInterval);
														}
														youtubeState.youtubePlayer.seekTo(nextNewTimeSecond);
														const newDefaultCountdown =
															globalMIDI.value.prevNextSecondsBefore >= 0
																? globalMIDI.value.prevNextSecondsBefore
																: secondFlag.seekSecondsBefore;
														if (newDefaultCountdown > 1 && secondFlag.showCountdown) {
															countdownDefaultBase = Math.min(
																5,
																Math.floor(newDefaultCountdown - 1)
															);
														}
													}
												} else {
													const durationNext = youtubeState.youtubePlayer.getDuration();
													layoutState.showCountdown = false;
													if (countdownInterval) {
														clearInterval(countdownInterval);
													}
													youtubeState.youtubePlayer.seekTo(durationNext - 0.2);
												}
											} else {
												const nextNewTime = Math.max(0, firstFlag.time - nextBefore);
												layoutState.showCountdown = false;
												if (countdownInterval) {
													clearInterval(countdownInterval);
												}
												youtubeState.youtubePlayer.seekTo(nextNewTime);
												const newDefaultCountdown =
													globalMIDI.value.prevNextSecondsBefore >= 0
														? globalMIDI.value.prevNextSecondsBefore
														: firstFlag.seekSecondsBefore;
												if (newDefaultCountdown > 1 && firstFlag.showCountdown) {
													countdownDefaultBase = Math.min(5, Math.floor(newDefaultCountdown - 1));
												}
											}
										}
									} else {
										const durationNext = youtubeState.youtubePlayer.getDuration();
										layoutState.showCountdown = false;
										if (countdownInterval) {
											clearInterval(countdownInterval);
										}
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
									layoutState.showCountdown = false;
									if (countdownInterval) {
										clearInterval(countdownInterval);
									}
									youtubeState.youtubePlayer.seekTo(newTimeLeft);
									break;
								case globalMIDI.value.right:
									const currentTimeRight = youtubeState.youtubePlayer.getCurrentTime();
									const durationRight = youtubeState.youtubePlayer.getDuration();
									const newTimeRight = Math.min(
										durationRight,
										currentTimeRight + globalMIDI.value.rightStep
									);
									layoutState.showCountdown = false;
									if (countdownInterval) {
										clearInterval(countdownInterval);
									}
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
									layoutState.showCountdown = false;
									if (countdownInterval) {
										clearInterval(countdownInterval);
									}
									youtubeState.youtubePlayer.seekTo(0);
									break;
							}
						}
					}
				}
			};
		}
	});

	function getFlagPoleClass(flag: Flag): string {
		let className = '';
		if (flag.sendPC >= 0 && flag.sendCC >= 0 && flag.sendCCValue >= 0) {
			className += 'flag-pole-teal-amber';
		} else if (flag.sendPC >= 0) {
			className += 'flag-pole-teal';
		} else if (flag.sendCC >= 0 && flag.sendCCValue >= 0) {
			className += 'flag-pole-amber';
		} else if (flag.seekCC >= 0) {
			className += 'flag-pole-violet';
		} else {
			className += 'flag-pole-blue';
		}

		if (playlistState.selectedFlag?.id == flag.id) {
			className += '-selected';
		}
		return className;
	}

	function getFlagNameClass(flag: Flag): string {
		if (flag.sendPC >= 0 && flag.sendCC >= 0 && flag.sendCCValue >= 0) {
			return 'text-teal-600';
		} else if (flag.sendPC >= 0) {
			return 'text-teal-600';
		} else if (flag.sendCC >= 0 && flag.sendCCValue >= 0) {
			return 'text-amber-600';
		} else if (flag.seekCC >= 0) {
			return 'text-violet-600';
		} else {
			return 'text-sky-600';
		}
	}

	function getFlagButtonClass(flag: Flag): string {
		if (flag.sendPC >= 0 && flag.sendCC >= 0 && flag.sendCCValue >= 0) {
			return 'flag-button-teal-amber';
		} else if (flag.sendPC >= 0) {
			return 'flag-button-teal';
		} else if (flag.sendCC >= 0 && flag.sendCCValue >= 0) {
			return 'flag-button-amber';
		} else if (flag.seekCC >= 0) {
			return 'flag-button-violet';
		} else {
			return 'flag-button-blue';
		}
	}

	function getFlagSelectClass(flag: Flag): string {
		if (flag.sendPC >= 0 && flag.sendCC >= 0 && flag.sendCCValue >= 0) {
			return 'flag-select-teal-amber';
		} else if (flag.sendPC >= 0) {
			return 'flag-select-teal';
		} else if (flag.sendCC >= 0 && flag.sendCCValue >= 0) {
			return 'flag-select-amber';
		} else if (flag.seekCC >= 0) {
			return 'flag-select-violet';
		} else {
			return 'flag-select-blue';
		}
	}

	function getFlagDescClass(flag: Flag): string {
		if (flag.disabled) {
			return 'flag-desc-disabled';
		} else if (flag.sendPC >= 0 && flag.sendCC >= 0 && flag.sendCCValue >= 0) {
			return 'flag-desc-teal-amber';
		} else if (flag.sendPC >= 0) {
			return 'flag-desc-teal';
		} else if (flag.sendCC >= 0 && flag.sendCCValue >= 0) {
			return 'flag-desc-amber';
		} else if (flag.seekCC >= 0) {
			return 'flag-desc-violet';
		} else {
			return 'flag-desc-blue';
		}
	}

	function getFlagDesc(flag: Flag): string {
		if (flag.name.length < 4) {
			return '';
		} else if (flag.sendPC >= 0 && flag.sendCC >= 0 && flag.sendCCValue >= 0) {
			return `PC ${flag.sendPC ? flag.sendPC : 0} CC ${flag.sendCC ? flag.sendCC : 0} ${flag.sendCCValue ? flag.sendCCValue : 0}`;
		} else if (flag.sendPC >= 0) {
			return `PC ${flag.sendPC ? flag.sendPC : 0}`;
		} else if (flag.sendCC >= 0 && flag.sendCCValue >= 0) {
			return `CC ${flag.sendCC ? flag.sendCC : 0} ${flag.sendCCValue ? flag.sendCCValue : 0}`;
		} else if (flag.seekCC >= 0) {
			return `${secondsToStringTime(flag.time)} (${flag.seekCC ? flag.seekCC : 0})`;
		} else {
			return secondsToStringTime(flag.time);
		}
	}

	function secondsToStringTime(totalSeconds: number) {
		totalSeconds = Math.floor(totalSeconds);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		let timeString = '';

		if (hours > 0) {
			timeString += `${hours}:`;
			// Add leading zero for minutes if hours are present and minutes are single digit
			timeString += minutes < 10 ? `0${minutes}:` : `${minutes}:`;
		} else {
			// No leading zero for minutes if hours are not present
			timeString += `${minutes}:`;
		}

		// Add leading zero for seconds if they are single digit
		timeString += seconds < 10 ? `0${seconds}` : `${seconds}`;

		return timeString;
	}

	function seek(flag: Flag) {
		if (youtubeState.youtubePlayer) {
			layoutState.showCountdown = false;
			if (countdownInterval) {
				clearInterval(countdownInterval);
			}
			const newTime = Math.max(0, flag.time - flag.seekSecondsBefore);
			youtubeState.youtubePlayer.seekTo(newTime);
			if (flag.seekSecondsBefore > 1 && flag.showCountdown) {
				countdownDefaultBase = Math.min(5, Math.floor(flag.seekSecondsBefore - 1));
			}
		}
	}

	function seekRealTime(time: number) {
		if (youtubeState.youtubePlayer) {
			layoutState.showCountdown = false;
			if (countdownInterval) {
				clearInterval(countdownInterval);
			}
			youtubeState.youtubePlayer.seekTo(time);
		}
	}

	async function onSubmitMIDI(
		event: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
			originalTarget: EventTarget & HTMLFormElement;
		}
	) {
		if (!playlistState.selectedVideo || !playlistState.selectedFlag) return;

		const data = JSON.stringify({
			flagId: playlistState.selectedFlag.id,
			name: playlistState.selectedFlag.name,
			time: playlistState.selectedFlag.time,
			seekCC: playlistState.selectedFlag.seekCC,
			seekSecondsBefore: playlistState.selectedFlag.seekSecondsBefore,
			sendCC: playlistState.selectedFlag.sendCC,
			disabled: playlistState.selectedFlag.disabled,
			showCountdown: playlistState.selectedFlag.showCountdown,
			sendCCValue: playlistState.selectedFlag.sendCCValue,
			sendPC: playlistState.selectedFlag.sendPC
		});

		const flagResponse = await fetch('/api/flag', {
			method: 'PATCH',
			body: data
		});
		const updatedFlag: Flag = await flagResponse.json();

		// Update state
		let flagIndex = playlistState.selectedVideo.flags.findIndex(
			(flag) => flag.id == updatedFlag.id
		);
		playlistState.selectedVideo.flags.splice(flagIndex, 1);
		playlistState.selectedVideo.flags.splice(flagIndex, 0, updatedFlag);

		MIDISubmitSuccess = true;
		setTimeout(() => {
			MIDISubmitSuccess = false;
		}, 2000);
	}

	async function midiAddFlag(flagName: string) {
		const formData = new FormData();

		if (youtubeState.youtubePlayer && playlistState.selectedVideo) {
			let seconds = youtubeState.youtubePlayer.getCurrentTime();

			formData.set('name', flagName);
			formData.set('time', seconds.toString());
			formData.set('videoId', playlistState.selectedVideo.id);

			const flagResponse = await fetch('/api/flag', {
				method: 'POST',
				body: formData
			});

			const createdFlag: Flag = await flagResponse.json();

			playlistState.selectedVideo.flags.push(createdFlag);
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
				(f) => f.id !== playlistState.selectedFlag?.id
			);
			playlistState.selectedFlag = undefined;
		} else {
		}
	}
</script>

<div class="relative flex h-36 flex-col rounded-xl px-[10px]">
	{#if layoutState.showCountdown}
		<div class="absolute top-[-180px] left-[-17px] box-border w-full px-8">
			<Timer {countdownName} {countdownTime} {countdownColor} />
		</div>
	{/if}

	<!-- NAV -->
	<div class="flex min-h-[52px] w-full flex-row justify-between">
		<!-- Left -->
		<div class="mr-2 flex flex-row space-x-2">
			{#if playlistState.selectedFlag}
				<div class="flex flex-row space-x-2">
					<!-- Buttons -->
					<div class="flex flex-row items-center space-x-2 text-nowrap">
						<button
							type="button"
							onclick={deleteFlag}
							aria-label="Delete Flag"
							class="flex cursor-pointer items-center rounded-xl bg-zinc-800 px-2 py-2 hover:bg-zinc-700 lg:px-4"
						>
							<span class="material-symbols-outlined">delete_forever</span>
							<span class="ml-1 hidden lg:block">Delete</span>
						</button>
						<button
							type="button"
							onclick={() => (playlistState.selectedFlag ? seek(playlistState.selectedFlag) : null)}
							aria-label="Seek"
							class="flex cursor-pointer items-center rounded-xl bg-zinc-800 px-2 py-2 hover:bg-zinc-700 lg:px-4"
						>
							<span class="material-symbols-outlined">video_search</span>
							<span class="ml-1 hidden lg:block">Seek</span>
						</button>
					</div>

					<div class="flex flex-col border-l-2 border-l-zinc-900 pl-2">
						<!-- Flag Name -->
						<div class="flex flex-row items-center space-x-1 text-nowrap">
							<button
								type="button"
								onclick={() => toggleDisableFlag(playlistState.selectedFlag)}
								aria-label="Disable Flag"
								class={playlistState.selectedFlag.disabled
									? 'flex cursor-pointer text-rose-700'
									: 'flex cursor-pointer text-zinc-100'}
							>
								<span class="material-symbols-outlined">flag</span>
							</button>
							<input
								class={getFlagNameClass(playlistState.selectedFlag)}
								style="padding: 0; min-width:85px"
								bind:value={playlistState.selectedFlag.name}
							/>
						</div>
						<!-- Flag Time -->
						<div class="flex flex-row items-center space-x-1 text-nowrap">
							<button
								type="button"
								onclick={() => toggleShowCountdown(playlistState.selectedFlag)}
								aria-label="Show Countdown"
								class={playlistState.selectedFlag.showCountdown
									? 'flex cursor-pointer text-sky-600'
									: 'flex cursor-pointer text-zinc-100'}
							>
								<span class="material-symbols-outlined">alarm</span>
							</button>
							<button
								type="button"
								onclick={() =>
									playlistState.selectedFlag ? seekRealTime(playlistState.selectedFlag.time) : null}
								class="text-md mr-auto flex flex-1 cursor-pointer justify-start text-zinc-400 hover:text-zinc-300"
							>
								{#if recentMicroTime}
									{playlistState.selectedFlag.time}
								{:else}
									{secondsToStringTime(playlistState.selectedFlag.time)}
								{/if}
							</button>
							<div class="flex-1"></div>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Right -->
		<div class="flex flex-row space-x-2">
			<!-- MIDI -->
			{#if playlistState.selectedFlag}
				<form
					class="mr-2 hidden flex-row space-x-2 border-r-2 border-r-zinc-900 pr-2 lg:flex"
					onsubmit={onSubmitMIDI}
				>
					<!-- CC -->
					<div class="flex flex-col">
						<div
							class="mt-1 flex max-w-16 min-w-16 flex-row items-center space-x-1 border-b-1 border-amber-800"
						>
							<span class="material-symbols-outlined !text-[16px]">sports_esports</span>
							<input
								class="p-0 text-sm"
								id="sendCC"
								bind:value={playlistState.selectedFlag.sendCC}
								autocomplete="off"
								type="number"
								required
								placeholder="CC"
							/>
						</div>
						<div
							class="mt-1 flex max-w-16 min-w-16 flex-row items-center space-x-1 border-b-1 border-amber-800"
						>
							<span class="material-symbols-outlined !text-[16px]">numbers</span>
							<input
								class="p-0 text-sm"
								id="sendCCValue"
								bind:value={playlistState.selectedFlag.sendCCValue}
								autocomplete="off"
								type="number"
								required
								placeholder="Val"
							/>
						</div>
					</div>
					<!-- SEEK -->
					<div class="flex flex-col">
						<div
							class="mt-1 flex max-w-16 min-w-16 flex-row items-center space-x-1 border-b-1 border-violet-800"
						>
							<span class="material-symbols-outlined !text-[16px]">video_search</span>
							<input
								class="p-0 text-sm"
								id="seekCC"
								bind:value={playlistState.selectedFlag.seekCC}
								autocomplete="off"
								type="number"
								required
								placeholder="Seek"
							/>
						</div>
						<div
							class="mt-1 flex max-w-16 min-w-16 flex-row items-center space-x-1 border-b-1 border-violet-800"
						>
							<span class="material-symbols-outlined !text-[16px]">timer</span>
							<input
								class="p-0 text-sm"
								id="seekSecondsBefore"
								bind:value={playlistState.selectedFlag.seekSecondsBefore}
								autocomplete="off"
								type="number"
								step="any"
								required
								placeholder="Sec"
							/>
						</div>
					</div>
					<!-- PC + Microshift -->
					<div class="flex flex-col">
						<div
							class="mt-1 flex max-w-16 min-w-16 flex-row items-center space-x-1 border-b-1 border-teal-800"
						>
							<span class="material-symbols-outlined !text-[16px]">computer</span>
							<input
								class="p-0 text-sm"
								id="sendPC"
								bind:value={playlistState.selectedFlag.sendPC}
								autocomplete="off"
								type="number"
								required
								placeholder="PC"
							/>
						</div>

						<div class="mt-1 flex flex-row space-x-1">
							<button
								class="flex flex-1 cursor-pointer items-center rounded bg-zinc-800 px-1 py-0.5 text-sm hover:bg-zinc-700"
								type="button"
								onclick={() => {
									if (playlistState.selectedFlag) {
										playlistState.selectedFlag.time = Math.max(
											0,
											playlistState.selectedFlag.time - 0.05
										);
										if (recentMicroInterval) {
											clearInterval(recentMicroInterval);
										}
										recentMicroTime = true;
										recentMicroInterval = setTimeout(() => {
											recentMicroTime = false;
										}, 2000);
									}
								}}
							>
								<span class="material-symbols-outlined !text-[20px]">clock_arrow_down</span>
							</button>
							<button
								class="flex flex-1 cursor-pointer items-center rounded bg-zinc-800 px-1 py-0.5 text-sm hover:bg-zinc-700"
								type="button"
								onclick={() => {
									if (playlistState.selectedFlag && youtubeState.youtubePlayer) {
										playlistState.selectedFlag.time = Math.min(
											youtubeState.youtubePlayer.getDuration(),
											playlistState.selectedFlag.time + 0.05
										);
										if (recentMicroInterval) {
											clearInterval(recentMicroInterval);
										}
										recentMicroTime = true;
										recentMicroInterval = setTimeout(() => {
											recentMicroTime = false;
										}, 2000);
									}
								}}
							>
								<span class="material-symbols-outlined !text-[20px]">clock_arrow_up</span>
							</button>
						</div>
					</div>
					<div class="flex w-[95px] min-w-[95px] items-center justify-center">
						<button
							class={MIDISubmitSuccess
								? 'mt-auto mb-auto flex w-[35px] cursor-pointer items-center justify-center rounded-xl bg-emerald-700 py-2 hover:bg-emerald-700'
								: 'mt-auto mb-auto flex w-[95px] cursor-pointer items-center justify-center rounded-xl bg-zinc-800 py-2 hover:bg-zinc-700'}
							style="transition: width 0.2s ease-in-out;"
							type="submit"
						>
							{#if MIDISubmitSuccess}
								<span
									in:fade={{ duration: 250, delay: 150 }}
									class="spinner material-symbols-outlined">check</span
								>
							{:else}
								<div
									in:fade={{ duration: 250, delay: 250 }}
									class="flex flex-row items-center justify-center"
								>
									<span class="material-symbols-outlined">save</span>
									<span class="ml-1">Save</span>
								</div>
							{/if}
						</button>
					</div>
				</form>
			{/if}

			<!-- ADD -->
			<div class="flex flex-row items-center space-x-2 text-nowrap">
				<button
					class="flex cursor-pointer items-center rounded-xl bg-zinc-800 px-2 py-2 hover:bg-zinc-700 lg:px-4"
					type="button"
					onclick={() => {
						layoutState.showAddFlag = true;
					}}
				>
					<span class="material-symbols-outlined">flag_check</span>
					<span class="ml-1 hidden lg:block">Add Flag</span>
				</button>
				<button
					class="flex cursor-pointer items-center rounded-xl bg-zinc-800 px-2 py-2 hover:bg-zinc-700 lg:px-4"
					type="button"
					onclick={() => {
						layoutState.showMidiAssign = true;
					}}
					aria-label="Midi Assign"
				>
					<span class="material-symbols-outlined">piano</span>
					<span class="ml-1 hidden lg:block">MIDI Assign</span>
				</button>
			</div>
		</div>
	</div>

	<!-- Timeline -->
	<div class="relative mt-2 flex h-full flex-col justify-between">
		{#if playlistState.selectedVideo}
			{#if playlistState.selectedVideo?.flags}
				{#each playlistState.selectedVideo.flags as flag}
					{#if (flag.time / timelineState?.timelineLength) * 100 <= 100}
						<div
							class="absolute z-100 h-full"
							style="left: {(flag.time / timelineState?.timelineLength) * 100}%"
						>
							<div class={getFlagPoleClass(flag)}>
								<!-- Countdown -->
								<!-- {#if flag.time - timelineState.currentTime <= 5 && flag.time - timelineState.currentTime >= 0} -->
								<!-- 	<div class="countdown-text"> -->
								<!-- 		{(flag.time - timelineState.currentTime).toFixed(2)} -->
								<!-- 	</div> -->
								<!-- {/if} -->
								<div class="flex flex-col">
									<button
										type="button"
										aria-label="Select"
										onclick={() => {
											playlistState.selectedFlag = flag;
											MIDISubmitSuccess = false;
										}}
										class={getFlagSelectClass(flag)}
									>
									</button>
									<button
										onclick={() => {
											playlistState.selectedFlag = flag;
											MIDISubmitSuccess = false;
											seek(flag);
										}}
										type="button"
										class={getFlagButtonClass(flag)}
									>
										<span class="text-zinc-300">
											{flag.name}
										</span>
									</button>
								</div>
								<button class={getFlagDescClass(flag)} onclick={() => clickFlagText(flag)}>
									{getFlagDesc(flag)}
								</button>
								{#if flag.showCountdown}
									<span class="material-symbols-outlined mt-[6px] pl-0.5 !text-[13px] text-zinc-100"
										>timer</span
									>
								{/if}
							</div>
						</div>
					{/if}
				{/each}
			{/if}
		{/if}

		<div class="relative mt-auto w-full bg-zinc-900">
			{#if percentComplete <= 100}
				<div
					class="z-10 h-[15px] bg-gradient-to-r from-rose-800 to-rose-950"
					style="width: {percentComplete}%"
				></div>
			{/if}
		</div>
		{#if timelineState.timelineLength}
			<div class="timeline-length-text">
				<!-- {secondsToStringTime(timelineState.timelineLength - timelineState.currentTime)} -->
				{secondsToStringTime(timelineState.timelineLength)}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "../../app.css";

	.spinner {
		animation: spin 0.25s linear 0.2s; /* Apply the animation */
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.countdown-text {
		@apply absolute text-sm text-rose-600;
		top: -20px;
		right: 0px;
		width: 100%;
	}

	.timeline-length-text {
		@apply absolute text-xs text-rose-900;
		right: 5px;
		bottom: -1px;
	}

	.flag-desc-disabled {
		@apply cursor-pointer pt-1 pl-1 text-xs text-rose-700 hover:text-rose-600;
	}

	.flag-pole-blue {
		@apply flex h-full flex-col items-start border-l-2 border-sky-800;
	}
	.flag-pole-blue-selected {
		@apply flex h-full flex-col items-start border-l-2 border-sky-500;
	}
	.flag-select-blue {
		@apply flex h-3 cursor-pointer rounded-tr-md;
		@apply bg-sky-800 hover:bg-sky-900;
	}
	.flag-button-blue {
		@apply min-h-[32px] cursor-pointer rounded-br-md;
		@apply bg-gradient-to-r from-sky-900 to-sky-950 pr-2 pb-2 pl-1 hover:from-sky-800;
	}
	.flag-desc-blue {
		@apply min-h-[20px] cursor-pointer pt-1 pl-1 text-xs text-sky-700 hover:text-sky-600;
	}

	.flag-pole-teal {
		@apply flex h-full flex-col items-start border-l-2 border-teal-800;
	}
	.flag-pole-teal-selected {
		@apply flex h-full flex-col items-start border-l-2 border-teal-500;
	}
	.flag-select-teal {
		@apply flex h-3 cursor-pointer rounded-tr-md;
		@apply bg-teal-800 hover:bg-teal-900;
	}
	.flag-button-teal {
		@apply min-h-[32px] cursor-pointer rounded-br-md;
		@apply bg-gradient-to-r from-teal-900 to-teal-950 pr-2 pb-2 pl-1 hover:from-teal-800;
	}
	.flag-desc-teal {
		@apply min-h-[20px] cursor-pointer pt-1 pl-1 text-xs text-teal-700 hover:text-teal-600;
	}

	.flag-pole-violet {
		@apply flex h-full flex-col items-start border-l-2 border-violet-800;
	}
	.flag-pole-violet-selected {
		@apply flex h-full flex-col items-start border-l-2 border-violet-500;
	}
	.flag-select-violet {
		@apply flex h-3 cursor-pointer rounded-tr-md;
		@apply bg-violet-800 hover:bg-violet-900;
	}
	.flag-button-violet {
		@apply min-h-[32px] cursor-pointer rounded-br-md;
		@apply bg-gradient-to-r from-violet-900 to-violet-950 pr-2 pb-2 pl-1 hover:text-violet-800;
	}
	.flag-desc-violet {
		@apply min-h-[20px] cursor-pointer pt-1 pl-1 text-xs text-violet-700 hover:text-violet-600;
	}

	.flag-pole-amber {
		@apply flex h-full flex-col items-start border-l-2 border-amber-800;
	}
	.flag-pole-amber-selected {
		@apply flex h-full flex-col items-start border-l-2 border-amber-500;
	}
	.flag-select-amber {
		@apply flex h-3 cursor-pointer rounded-tr-md;
		@apply bg-amber-800 hover:bg-amber-900;
	}
	.flag-button-amber {
		@apply min-h-[32px] cursor-pointer rounded-br-md;
		@apply bg-gradient-to-r from-amber-900 to-amber-950 pr-2 pb-2 pl-1 hover:from-amber-800;
	}
	.flag-desc-amber {
		@apply min-h-[20px] cursor-pointer pt-1 pl-1 text-xs text-amber-700 hover:text-amber-600;
	}

	.flag-pole-teal-amber {
		@apply flex h-full flex-col items-start border-l-2 border-teal-800;
	}
	.flag-pole-teal-amber-selected {
		@apply flex h-full flex-col items-start border-l-2 border-teal-500;
	}
	.flag-select-teal-amber {
		@apply flex h-3 cursor-pointer rounded-tr-md;
		@apply bg-gradient-to-r from-teal-800 to-amber-800 hover:from-teal-900;
	}
	.flag-button-teal-amber {
		@apply min-h-[32px] cursor-pointer rounded-br-md;
		@apply bg-gradient-to-r from-teal-900 to-amber-950 pr-2 pb-2 pl-1 hover:from-teal-800;
	}
	.flag-desc-teal-amber {
		@apply min-h-[20px] cursor-pointer pt-1 pl-1 text-xs;
		@apply bg-gradient-to-r from-teal-700 to-amber-700 bg-clip-text text-transparent hover:from-teal-600;
	}

	input {
		outline: none;
		border: none;
		min-width: 0;
		width: 100%;
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
