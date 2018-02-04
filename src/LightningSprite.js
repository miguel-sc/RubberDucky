import { Graphics, BLEND_MODES } from 'pixi.js'
import { DropShadowFilter } from '@pixi/filter-drop-shadow'
import App from './App'

export default class LightningSprite extends Graphics {
  constructor() {
    super()
    const start = [0, -App.renderer.height / 2]
    const end = [0, App.renderer.height / 2]
    this.boundsPadding = 20
    this.clear()
    this.lightning = this.breakSegment([start,end], 4, 60, 0.8)
    this.drawLightning(this.lightning, 8)
    this.lightning = this.breakSegment([start,end], 4, 60, 0.8)
    this.drawLightning(this.lightning, 6)
    this.lightning = this.breakSegment([start,end], 4, 60, 0.8)
    this.drawLightning(this.lightning, 4)
    App.stage.addChild(this)
    this.blendMode = BLEND_MODES.ADD
    this.filters = [new DropShadowFilter(0, 0, 10, 0xffffff, 1)]
  }

  drawLightning(branch, lineWidth) {
    this.lineStyle(lineWidth, 0xffffff)
    let children = branch.children
    let segments = branch.segments
    this.moveTo(segments[0][0][0], segments[0][0][1])
    for (let i = 0; i < segments.length; i++) {
      this.lineTo(segments[i][1][0], segments[i][1][1])
    }
    for (let j = 0; j < children.length; j++) {
      this.drawLightning(children[j], lineWidth * 0.7)
    }
  }

  breakSegment(segment, n, maxOffset, forkProbability) {
    const lengthscale = 0.7
    const maxAngle = 10 / 180 * Math.PI
    if (n > 0) {
      let midpoint = [(segment[0][0] + segment[1][0]) / 2, (segment[0][1] + segment[1][1]) / 2]
      const normal = [segment[0][1] - segment[1][1], segment[1][0] - segment[0][0]]
      const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1])
      const offset = (Math.random() - 0.5) * maxOffset * 2
      midpoint[0] += normal[0] / length * offset
      midpoint[1] += normal[1] / length * offset

      const firstBranch = this.breakSegment([segment[0], midpoint], n - 1, maxOffset / 2, forkProbability * 0.7)
      const secondBranch = this.breakSegment([midpoint, segment[1]], n - 1, maxOffset / 2, forkProbability * 0.7)
      let branch = {}
      branch.segments = firstBranch.segments.concat(secondBranch.segments)
      branch.children = firstBranch.children.concat(secondBranch.children)

      if (Math.random() < forkProbability) {
        const direction = [midpoint[0] - segment[0][0], midpoint[1] - segment[0][1]]
        const angle = (Math.random() - 0.5) * maxAngle * 2

        let splitend = []
        splitend[0] = (Math.cos(angle) * direction[0] - Math.sin(angle) * direction[1]) * lengthscale + midpoint[0]
        splitend[1] = (Math.sin(angle) * direction[0] + Math.cos(angle) * direction[1]) * lengthscale + midpoint[1]

        const fork = this.breakSegment([midpoint, splitend], n - 1, maxOffset / 2 * lengthscale, forkProbability)
        branch.children = branch.children.concat(fork)
      }
      return branch
    } else {
      let branch = {}
      branch.segments = [segment]
      branch.children = []
      return branch
    }
  }
}
