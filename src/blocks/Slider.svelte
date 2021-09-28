<script lang="ts">
  export let min = 0
  export let max = 1
  export let rate = 0.1
  export let name = ''
  export let value = null //(max + min) / 2
  export let values = null

  let type = 'range'
  $: values != null && (type = 'values')

  const clamp = (v, mi, ma) => {
    if (v < mi) return mi
    if (v > ma) return ma
    return v
  }

  const changeValue = {
    range: (diff) => {
      value = clamp((diff / Math.abs(diff)) * -rate + value, min, max)
    },
    values: (diff) => {
      const found = values.indexOf(value)
      const next = found + diff / Math.abs(diff)
      if (next < 0 || next >= values.length) return
      value = values[next]
    },
  }
  let scrollpp = 0
  let scrollp = 0
  let deltaY = 0
  let ticking = false
  const handleWheel = (event) => {
    console.log('hi')
    event.preventDefault()
    // scrollpp = scrollp
    // scrollp = window.scrollY
    deltaY = event.deltaY

    if (!ticking) {
      window.requestAnimationFrame(() => {
        // changeValue(scrollp - scrollpp)
        changeValue[type](deltaY)
        ticking = false
      })
      ticking = true
    }
  }
</script>

<div class="slider" on:wheel={handleWheel} on:mousewheel={handleWheel}>
  <div class="name">{name}</div>
  <div class="container">
    <div
      class="value"
      class:value_lower={Math.abs(value - min) < 0.01}
      class:value_upper={Math.abs(value - max) < 0.01}
      >{#if type === 'range'}{Math.round(value * 100) / 100}
      {:else}{value}{/if}</div
    >
  </div>
</div>

<style>
  .slider {
    overflow: hidden;
    min-width: 48px;
    text-align: center;
    padding: 4px 0;
  }
  .name {
    font-family: inherit;
    min-height: 20px;
    line-height: 20px;
    margin-bottom: 4px;
  }

  .container {
    /* min-height: 40px; */
    display: flex;
    justify-content: center;
    align-items: center;
    /* border: 1px dashed pink; */
    padding: 0 4px;
  }

  .value {
    border-left: 1px solid #0000;
    border-right: 1px solid #0000;
    line-height: 20px;
    padding: 0 4px;
  }

  .value_lower {
    border-left-color: #f00;
  }
  .value_upper {
    border-right-color: #f00;
  }
</style>
