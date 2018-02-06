import { Container } from 'pixi.js'
import LightningSprite from './LightningSprite'
import App from './App'

export default class LightningController extends Container {
  constructor(view) {
    super()
    this.charged = true
    view.addEventListener('click', (event) => this.handleClick(event))
    view.addEventListener('touchend', (event) => this.handleClick(event))
  }

  handleClick(event) {
    if (this.charged) {
      this.spawnLightning(event.clientX - window.innerWidth / 2)
      this.charged = false
      setTimeout(() => {this.charged = true}, 400)
    }
  }

  spawnLightning(x) {
    let start, end
    const deltaX = Math.random() * 0.5 + 0.5
    if (window.innerWidth < 500) {
      start = [0, - window.innerHeight / 2]
      end = [0, window.innerHeight / 2]
    } else {
      start = [x * deltaX, - window.innerHeight / 2]
      end = [x, window.innerHeight / 2]
    }
    const lightning = new LightningSprite(start, end)
    this.addChild(lightning)
    window.requestAnimationFrame(() => this.applyImpulse(end[0]))
  }

  applyImpulse(x) {
    const count = App.particleSystemSprite.particleSystem.GetParticleCount()
    const pos_offset = App.particleSystemSprite.particleSystem.GetPositionBuffer()
    const vel_offset = App.particleSystemSprite.particleSystem.GetVelocityBuffer()
    const raw_pos = new Float32Array(Box2D.HEAPU8.buffer, pos_offset.e, count * 2)
    const raw_vel = new Float32Array(Box2D.HEAPU8.buffer, vel_offset.e, count * 2)
    for (let i = 0; i < count; i++) {
      const distance = Math.sqrt(
        (raw_pos[2 * i] - x) * (raw_pos[2 * i] - x) +
        (raw_pos[2 * i + 1] - window.innerHeight / 2) * (raw_pos[2 * i + 1] - window.innerHeight / 2)
      )
      raw_vel[2 * i] += (raw_pos[2 * i] - x) / distance * 7
      raw_vel[2 * i + 1] += (raw_pos[2 * i + 1] - window.innerHeight / 2) / distance * 7
    }
  }
}
