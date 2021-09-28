import { InjectorElement } from './wa'

export class WCMediaElementAudioSource extends InjectorElement(
  HTMLAudioElement
) {
  connectedCallback() {
    this.provide(
      new Map([
        [
          AudioNode,
          new MediaElementAudioSourceNode(this.inject(AudioContext), {
            mediaElement: true,
          }),
        ],
      ])
    )
  }
}

export class WCGain extends InjectorElement(HTMLElement) {
  #node = new GainNode(this.inject(AudioContext))
  connectedCallback() {
    this.provide(new Map([[AudioNode, this.#node]]))
    this.inject(AudioNode).connect(this.#node)
  }

  attributeChangedCallback(name, _, value) {
    this.#node[name].value = parseFloat(value)
  }

  static get observedAttributes() {
    return ['gain']
  }
}

export class WCDestination extends InjectorElement(HTMLElement) {
  connectedCallback() {
    this.inject(AudioNode).connect(this.inject(AudioContext).destination)
  }
}
