<script lang="ts">
  import Socket from './Socket.svelte'
</script>

<div class="node">
  <div class="input">
    <slot name="input" />
  </div>
  <div class="content"><slot name="content" /></div>
  <div class="output">
    <slot name="output" />
  </div>
</div>

<style>
  .node {
    padding: 5px;
    display: inline-flex;
    vertical-align: top;

    border: 1px dashed #555;
  }

  .content {
    border: 1px solid #555;
  }

  .node > *:not(:last-child):not(:empty) {
    margin-right: 10px;
  }

  .input::empty {
    margin-right: 0;
  }
</style>
