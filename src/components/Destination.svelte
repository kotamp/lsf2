<script>
  import { createEventDispatcher } from 'svelte'
  import Node from '../blocks/Node.svelte'
  import Socket from '../blocks/Socket.svelte'
  export let ctx

  const dispatch = createEventDispatcher()
  const handleIn = () => dispatch('input', { node: ctx.destination })
</script>

<Node>
  <div slot="input">
    <Socket hint="in" on:click={handleIn} />
  </div>
  <div slot="content">HERE IS YOUR COOL SPEAKERS :)</div>
</Node>
