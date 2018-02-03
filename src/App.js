import { Application } from 'pixi.js'
import LiquidfunSprite from './LiquidfunSprite'

class App extends Application {
  constructor(options) {
    super(options)
    this.renderer.render(this.stage)
    let gravity = new Box2D.b2Vec2(0, 100)
    this.world = new Box2D.b2World(gravity)
  }

  init() {
    this.createParticleSystem()
    this.spawnParticles(50, 0, 0)
    //console.log(this.particleSystemSprite.particleSystem.GetParticleCount())
    this.ticker.add(() => this.update())
  }

  update() {
    this.world.Step(1/60, 8, 3)
  }

  createParticleSystem() {
    let psd = new Box2D.b2ParticleSystemDef()
    psd.set_radius(1.0)
    let particleSystem = this.world.CreateParticleSystem(psd)
    particleSystem.SetMaxParticleCount(5000)
    this.particleSystemSprite = new LiquidfunSprite(particleSystem)
    this.stage.addChild(this.particleSystemSprite)
  }

  spawnParticles(radius, x, y) {
    let color = new Box2D.b2ParticleColor(255, 255, 255, 255)
    let pgd = new Box2D.b2ParticleGroupDef()
    let shape = new Box2D.b2CircleShape()

    shape.set_m_radius(radius)
    shape.set_m_p(new Box2D.b2Vec2(x, y))
    pgd.set_shape(shape)
    pgd.set_color(color)

    let group = this.particleSystemSprite.particleSystem.CreateParticleGroup(pgd)
    return group
  }
}

// Singleton
export default new App({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: false,
  backgroundColor : 0x04052E
})
