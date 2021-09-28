<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import Node from '../blocks/Node.svelte'
  import Socket from '../blocks/Socket.svelte'
  import Slider from '../blocks/Slider.svelte'

  export let ctx
  export let src
  export let dest
  let gainValue = 0.01

  let audionode = null

  onMount(() => {
    audionode = new GainNode(ctx)
  })

  $: {
    if (audionode != null) {
      audionode.disconnect()
      if (src != null) {
        src.connect(audionode)
        if (dest != null) audionode.connect(dest)
      }
    }
  }

  $: {
    if (audionode != null) {
      audionode.gain.setValueAtTime(gainValue, 0)
    }
  }

  const dispatch = createEventDispatcher()
  const handleIn = () => dispatch('input', { node: audionode })
  const handleGain = () => dispatch('input', { node: audionode.gain })
  const handleOut = () => dispatch('output', { node: audionode })
</script>

<Node>
  <div slot="input">
    <Socket hint="in" on:click={handleIn} />
    <Socket hint="gain" param on:click={handleGain} />
  </div>
  <div slot="content" style="display: flex;">
    <Slider min={0} max={3} rate={0.1} name="Gain" bind:value={gainValue} />
  </div>
  <div slot="output"><Socket hint="out" output on:click={handleOut} /></div
  ></Node
>
