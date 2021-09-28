<script>
  import { createEventDispatcher } from 'svelte'
  import Node from '../blocks/Node.svelte'
  import Socket from '../blocks/Socket.svelte'
  export let ctx
  export let dest
  export let src
  let audionode = null

  const create = (node) => {
    audionode = new MediaElementAudioSourceNode(ctx, { mediaElement: node })
  }

  $: {
    if (audionode != null) {
      audionode.disconnect()
      if (dest != null) {
        audionode.connect(dest)
      }
    }
  }
  const dispatch = createEventDispatcher()
  const handleOut = () => dispatch('output', { node: audionode })
</script>

<Node>
  <audio controls use:create slot="content">
    <source {src} />
  </audio>
  <Socket hint="out" output slot="output" on:click={handleOut} />
</Node>
