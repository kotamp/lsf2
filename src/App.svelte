<script lang="ts">
  import AudioSource from './components/AudioSource.svelte'
  import Node from './blocks/Node.svelte'
  import Gain from './components/Gain.svelte'
  import Destination from './components/Destination.svelte'
  import TimeDomain from './components/TimeDomain.svelte'
  import FreqDomain from './components/FreqDomain.svelte'
  import Osc from './components/Osc.svelte'
  let ctx = null
  // ctx = new AudioContext()

  const start = () => {
    ctx = new AudioContext()
  }

  const graph = new Map()

  let currentInput = null
  let currentOutput = null

  const connect = () => {
    if (currentInput != null && currentOutput != null) {
      if (graph.has(currentInput)) {
        const mm = graph.get(currentInput)
        if (mm.has(currentOutput)) {
          currentInput.disconnect(currentOutput)
          mm.delete(currentOutput)
          currentInput = null
          currentOutput = null
          return
        }

        mm.set(currentOutput, true)
        currentInput.connect(currentOutput)
        currentInput = null
        currentOutput = null
        return
      }

      const mm = new Map()
      mm.set(currentOutput, true)
      graph.set(currentInput, mm)
      currentInput.connect(currentOutput)
      console.log('connected', currentInput, currentOutput)
      currentInput = null
      currentOutput = null
    }
  }

  const handleInput = (event) => {
    const node = event.detail.node
    if (currentOutput === node) {
      currentOutput = null
    } else {
      currentOutput = node
    }
    connect()
  }
  const handleOutput = (event) => {
    const node = event.detail.node
    if (currentInput === node) {
      currentInput = null
    } else {
      currentInput = node
    }
    connect()
  }
</script>

<div>
  <button on:click={start}>start ctx</button>
  {#if ctx != null}
    <AudioSource
      {ctx}
      src="daisuke.m4a"
      on:input={handleInput}
      on:output={handleOutput}
    />
    <AudioSource
      {ctx}
      src="hi.wav"
      on:input={handleInput}
      on:output={handleOutput}
    />
    <AudioSource
      {ctx}
      src="003.wav"
      on:input={handleInput}
      on:output={handleOutput}
    />
    <Gain
      {ctx}
      src={null}
      dest={null}
      gain={null}
      on:input={handleInput}
      on:output={handleOutput}
    />
    <Destination
      {ctx}
      src={null}
      on:input={handleInput}
      on:output={handleOutput}
    />

    <TimeDomain {ctx} on:input={handleInput} on:output={handleOutput} />
    <FreqDomain {ctx} on:input={handleInput} on:output={handleOutput} />
    <Osc {ctx} on:input={handleInput} on:output={handleOutput} />
    <Osc {ctx} on:input={handleInput} on:output={handleOutput} />
  {/if}
</div>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
