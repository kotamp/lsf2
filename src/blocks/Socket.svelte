<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  const click = () => dispatch('click')

  export let param = false
  export let hint = ''
  export let output = false
</script>

<div
  class="socket"
  class:socket_output={output}
  class:socket_param={param}
  on:click={click}
  >{#if hint.length !== 0}
    <div class="hint">{hint}</div>
  {/if}</div
>

<style>
  .socket {
    position: relative;
    display: flex;
    align-items: center;
  }

  .socket:not(:last-child) {
    margin-bottom: 5px;
  }

  .socket::before {
    content: '';
    overflow: hidden;
    /* vertical-align: top; */
    min-width: 16px;
    min-height: 16px;
    box-sizing: border-box;
    border: 3px solid #0f0;
    border-radius: 50%;
  }

  .socket_output::before {
    border-color: #00f;
  }
  .socket_param::before {
    border-color: #f00;
  }
  .socket:hover .hint {
    /* background-color: #f00; */
    display: block;
  }

  .hint {
    display: none;
    position: absolute;
    top: 80%;
    right: 100%;
    margin: 2px;
    padding: 5px;

    background-color: #111;
    z-index: 100;
    line-height: 0.9;
    border: 1px dashed pink;
  }
</style>
