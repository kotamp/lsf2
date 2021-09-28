import { InjectorElement } from './wa'

export default class WCAudioContext extends InjectorElement(HTMLElement) {
  connectedCallback() {
    this.provide(new Map([[AudioContext, new AudioContext()]]))
  }
}

customElements.define('audio-context', WCAudioContext)
