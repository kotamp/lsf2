<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import Node from '../blocks/Node.svelte'
  import Socket from '../blocks/Socket.svelte'
  import Slider from '../blocks/Slider.svelte'
  export let ctx

  let analyser = null
  let times = null
  let minDecibels = -100
  let maxDecibels = -30
  let smoothing = 0.8
  let fftSize = 2048

  // $: if (analyser != null) {
  //   analyser.minDecibels = minDecibels
  //   console.log(analyser)
  // }
  $: analyser != null && (analyser.minDecibels = minDecibels)
  $: analyser != null && (analyser.maxDecibels = maxDecibels)
  $: analyser != null && (analyser.smoothingTimeConstant = smoothing)
  $: {
    if (analyser != null) {
      analyser.fftSize = fftSize
      times = new Uint8Array(analyser.frequencyBinCount)
    }
  }

  onMount(() => {
    analyser = ctx.createAnalyser()
    times = new Uint8Array(analyser.frequencyBinCount)
  })

  let drw = null,
    W = null,
    H = null

  const dispatch = createEventDispatcher()
  const handleIn = () => dispatch('input', { node: analyser })

  let raf = 0
  const draw = (canvas) => {
    analyser.getByteTimeDomainData(times)

    drw = canvas.getContext('2d')
    H = canvas.height
    W = canvas.width
    drw.clearRect(0, 0, W, H)
    for (let i = 0; i < analyser.frequencyBinCount; i++) {
      const v = times[i]
      const percent = v / 256
      const y = H - H * percent
      const width = W / analyser.frequencyBinCount
      drw.fillStyle = 'green'
      drw.fillRect(i * width, y, 1, 2)
    }
    raf = window.requestAnimationFrame(() => draw(canvas))
  }

  const prepare = (node) => {
    raf = window.requestAnimationFrame(() => draw(node))
    return () => {
      window.cancelAnimationFrame(raf)
    }
  }
</script>

<Node>
  <div slot="input">
    <Socket hint="in" on:click={handleIn} />
  </div>
  <div slot="content"
    ><canvas width="300" height="100" use:prepare /><div class="row">
      <Slider
        min={-200}
        max={maxDecibels - 1}
        bind:value={minDecibels}
        name="minDb"
        rate={1}
      />
      <Slider
        min={minDecibels + 1}
        max={0}
        bind:value={maxDecibels}
        name="maxDb"
        rate={1}
      />
      <Slider min={0} max={1} bind:value={smoothing} name="smooth" rate={0.1} />
      <Slider
        values={[32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768]}
        bind:value={fftSize}
        name="fftsize"
      />
    </div></div
  >
</Node>

<style>
  .row {
    display: flex;
  }
</style>
