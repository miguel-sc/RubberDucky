import { Container, WebGLRenderer } from 'pixi.js'
import LightningRenderer from './LightningRenderer'

export default class LightningSprite extends Container {
  constructor() {
    super()
    const start = [0,0]
    const end = [0,100]
    this.segments = this.breakSegment([start,end], 4, 20)
  }

  breakSegment(segment, n, maxOffset) {
    if (n > 0) {
      let midpoint = [(segment[0][0] + segment[1][0]) / 2, (segment[0][1] + segment[1][1]) / 2]
      const normal = [segment[0][1] - segment[1][1], segment[1][0] - segment[0][0]]
      const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
      const offset = (Math.random() - 0.5) * maxOffset * 2
      midpoint[0] += normal[0] / length * offset
      midpoint[1] += normal[1] / length * offset
      const firstSegment = this.breakSegment([segment[0], midpoint], n - 1, maxOffset / 2)
      const secondSegment = this.breakSegment([midpoint, segment[1]], n - 1, maxOffset / 2)
      return firstSegment.concat(secondSegment)
    } else {
      return [segment]
    }
  }

  _renderWebGL(renderer) {
    renderer.setObjectRenderer(renderer.plugins.lightning)
    renderer.plugins.lightning.render(this)
  }
}

WebGLRenderer.registerPlugin(LightningRenderer.pluginName, LightningRenderer)
