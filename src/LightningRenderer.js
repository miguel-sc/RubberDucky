import { ObjectRenderer } from 'pixi.js'

export default class LightningRenderer extends ObjectRenderer {
  constructor(renderer) {
    super(renderer)
    this.renderer = renderer
  }
}

LightningRenderer.pluginName = 'lightning'
