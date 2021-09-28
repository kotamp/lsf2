<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import Node from '../blocks/Node.svelte'
  import Socket from '../blocks/Socket.svelte'
  import Slider from '../blocks/Slider.svelte'
  export let ctx

  let analyser = null
  let freq = null
  let minDecibels = -100
  let maxDecibels = -30
  let smoothing = 0.8
  let fftSize = 2048

  let minFreq = 24
  let leftFreq = minFreq
  let rightFreq = 16000
  let nyquist = ctx.sampleRate / 2
  let isLogScale = 0

  $: {
    minFreq = Math.ceil((nyquist / fftSize) * 2)
    if (leftFreq < minFreq) leftFreq = minFreq
  }

  // $: if (analyser != null) {
  //   analyser.minDecibels = minDecibels
  //   console.log(analyser)
  // }
  $: analyser != null && (analyser.minDecibels = minDecibels)
  $: analyser != null && (analyser.maxDecibels = maxDecibels)
  $: analyser != null && (analyser.smoothingTimeConstant = smoothing)
  $: if (analyser != null) {
    analyser.fftSize = fftSize
    freq = new Uint8Array(analyser.frequencyBinCount)
  }

  onMount(() => {
    analyser = ctx.createAnalyser()
    freq = new Uint8Array(analyser.frequencyBinCount)
  })

  let drw = null,
    W = null,
    H = null

  const dispatch = createEventDispatcher()
  const handleIn = () => dispatch('input', { node: analyser })

  let raf = 0

  const scale = {}
  scale.linear = (left, right, from, to) => (value) => {
    return ((value - left) / (right - left)) * (to - from) + from
  }
  scale.log = (left, right, from, to) => (value) => {
    const s = scale.linear(Math.log10(left), Math.log10(right), from, to)
    return s(Math.log10(value))
  }

  const draw = (canvas) => {
    analyser.getByteFrequencyData(freq)

    drw = canvas.getContext('2d')
    H = canvas.height
    W = canvas.width
    drw.clearRect(0, 0, W, H)

    const xScale = scale[isLogScale ? 'log' : 'linear'](
      leftFreq,
      rightFreq,
      0,
      W
    )
    // console.log(leftFreq, rightFreq)
    // console.log(xScale(leftFreq), xScale(rightFreq))
    // debugger

    const yScale = scale.linear(0, 255, H, 0)

    const freqStep = nyquist / analyser.frequencyBinCount
    const size = Math.round((analyser.frequencyBinCount * rightFreq) / nyquist)

    for (let i = 1; i < 10; i++) {
      drw.fillStyle = 'hsl(' + i * 36 + ', 100%, 50%)'
      drw.fillRect(xScale(i * 10), 0, 1, H)
      drw.fillRect(xScale(i * 100), 0, 1, H)
      drw.fillRect(xScale(i * 1000), 0, 1, H)
    }

    const points = []
    for (let i = 0; i < size; i++) {
      const f = freqStep * i
      if (f < leftFreq || f > rightFreq) continue
      points.push([xScale(f), yScale(freq[i])])
    }

    drw.beginPath()
    if (points.length > 0) drw.moveTo(points[0][0], points[0][1])
    for (let i = 0; i < points.length; i++) {
      drw.lineTo(points[i][0], points[i][1])
    }
    drw.lineWidth = 1
    drw.strokeStyle = 'orange'
    drw.stroke()

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
    ><canvas width="500" height="300" use:prepare /><div class="row">
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
      <Slider
        min={minFreq}
        max={rightFreq}
        rate={10}
        bind:value={leftFreq}
        name="left"
      />
      <Slider
        min={leftFreq}
        max={nyquist}
        rate={10}
        bind:value={rightFreq}
        name="right"
      />
      <Slider values={[0, 1]} bind:value={isLogScale} name="log" />
    </div></div
  >
</Node>

<style>
  .row {
    display: flex;
  }
</style>
