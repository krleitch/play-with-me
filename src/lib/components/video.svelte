<script>
  import Youtube from '$lib/youtube.svelte';

  let player

  const toggle = () => {
    console.log('changing video id')
    player.loadVideoById("dQw4w9WgXcQ");
  }
</script>

<Youtube bind:player/>

<button on:click={toggle}>change video</button>

