import { Container } from 'pixi.js'
import LightningSprite from './LightningSprite'

export default class LightningController extends Container {
  constructor(view) {
    super()
    this.charged = true
    view.addEventListener('click', () => this.handleClick())
  }

  handleClick() {
    if (this.charged) {
      this.spawnLightning()
      this.charged = false
      setTimeout(() => {this.charged = true}, 400)
    }
  }

  spawnLightning() {
    const x = (Math.random() - 0.5) * (window.innerWidth - 500)
    const deltaX = (Math.random() - 0.5) * 500

    const start = [x, - window.innerWidth / 2]
    const end = [x + deltaX, window.innerHeight / 2]

    const lightning = new LightningSprite(start, end)
    this.addChild(lightning)
  }
}
