<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import Node from '../blocks/Node.svelte'
  import Socket from '../blocks/Socket.svelte'
  import Slider from '../blocks/Slider.svelte'
  import Gain from './Gain.svelte'

  export let ctx
  export let src
  export let dest
  export let type = 'sine'
  let detune = 0
  let frequency = 440
  // let playing = 0

  let osc = {}
  let gain = {}
  let freqGain = null
  let freqConst = null
  let detGain = null
  let detConst = null
  let master = null

  $: {
    freqConst != null && freqConst.offset.setValueAtTime(frequency, 0)

    console.log(freqConst)
  }
  $: detConst != null && detConst.offset.setValueAtTime(detune, 0)

  $: {
    if (master != null) {
      for (const key in gain) {
        gain[key].gain.setValueAtTime(key === type ? 1 : 0, 0)
      }
    }
  }
  // $: audionode != null && (playing ? audionode.stop() : audionode.start())
  onMount(() => {
    osc.sine = new OscillatorNode(ctx, { type: 'sine' })
    osc.sawtooth = new OscillatorNode(ctx, { type: 'sawtooth' })
    osc.square = new OscillatorNode(ctx, { type: 'square' })
    osc.triangle = new OscillatorNode(ctx, { type: 'triangle' })

    gain.sine = new GainNode(ctx)
    gain.sawtooth = new GainNode(ctx)
    gain.square = new GainNode(ctx)
    gain.triangle = new GainNode(ctx)

    freqGain = new GainNode(ctx)
    freqConst = new ConstantSourceNode(ctx)
    freqConst.start()
    detGain = new GainNode(ctx)
    detConst = new ConstantSourceNode(ctx)
    detConst.start()
    master = new GainNode(ctx)

    freqConst.connect(freqGain)
    detConst.connect(detGain)
    const keys = Object.keys(osc)
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i]
      freqConst.connect(freqGain)
      freqGain.connect(osc[k].frequency)
      detGain.connect(osc[k].detune)
      osc[k].connect(gain[k])
      gain[k].connect(master)
      osc[k].start()
    }
  })

  const dispatch = createEventDispatcher()
  const provide = (node) => () => dispatch('input', { node })
  const supply = (node) => () => dispatch('output', { node })
</script>

<Node>
  <div slot="input">
    <Socket hint="gain" param on:click={provide(master.gain)} />
    <Socket hint="freq" param on:click={provide(freqGain)} />
    <Socket hint="detune" param on:click={provide(detGain)} />
  </div>
  <div slot="content" style="display: flex;">
    <Slider
      values={['sine', 'square', 'sawtooth', 'triangle']}
      name="type"
      bind:value={type}
    />
    <Slider min={1} max={2000} rate={10} name="freq" bind:value={frequency} />
    <Slider min={-50} max={50} rate={1} name="detune" bind:value={detune} />
  </div>
  <div slot="output">
    <Socket hint="out" output on:click={supply(master)} />
  </div></Node
>
