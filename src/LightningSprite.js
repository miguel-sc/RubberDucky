import { Container, WebGLRenderer } from 'pixi.js'
import LightningRenderer from './LightningRenderer'

export default class LightningSprite extends Container {
  constructor() {
    super()
  }

  _renderWebGL(renderer) {
    renderer.setObjectRenderer(renderer.plugins.lightning)
    renderer.plugins.lightning.render(this)
  }
}

WebGLRenderer.registerPlugin(LightningRenderer.pluginName, LightningRenderer)
