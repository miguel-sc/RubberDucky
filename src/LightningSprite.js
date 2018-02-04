import { Graphics, BLEND_MODES } from 'pixi.js'
import { DropShadowFilter } from '@pixi/filter-drop-shadow'
import App from './App'

export default class LightningSprite extends Graphics {
  constructor() {
    super()
    const start = [0, -App.renderer.height / 2]
    const end = [0, App.renderer.height / 2]
    this.segments = this.breakSegment([start,end], 5, 100)
    this.drawLightning()
    App.stage.addChild(this)
    this.blendMode = BLEND_MODES.ADD
    this.filters = [new DropShadowFilter(0, 0, 10, 0xffffff, 1)]
  }

  drawLightning() {
    this.clear()
    this.lineStyle(8, 0xffffff)
    this.boundsPadding = 20
    this.moveTo(this.segments[0][0][0], this.segments[0][0][1])
    for (let i = 0; i < this.segments.length; i++) {
      this.lineTo(this.segments[i][1][0], this.segments[i][1][1])
    }
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
}
