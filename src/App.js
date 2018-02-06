import { Application } from 'pixi.js'
import LiquidfunSprite from './LiquidfunSprite'
//import LightningController from './LightningController'
import RubberDucky from './RubberDucky'
import { gravity, backgroundColor, particleRadius, maxParticleCount, PTM,
  timeStep, positionIterations, velocityIterations,
  particleIterations, clickImpulse, widthBreakpoint } from './Constants'

class App extends Application {
  constructor(options) {
    super(options)
    this.renderer.render(this.stage)
    this.world = new Box2D.b2World(gravity)
    this.stage.position.set(window.innerWidth / 2, window.innerHeight / 2)
  }

  init() {
    this.createParticleSystem()
    if (window.innerWidth > widthBreakpoint) {
      this.particleGroup = this.spawnParticles(1.15, 0, 0)
    } else {
      this.particleGroup = this.spawnParticles(0.76, 0, 0)
    }
    //console.log(this.particleSystemSprite.particleSystem.GetParticleCount())

    this.createBoundingBox()
    this.rubberDucky = new RubberDucky(0,(this.renderer.height / 2 - 0.17 * PTM))
    this.stage.addChild(this.rubberDucky)
    //this.stage.addChild(new LightningController(this.view))

    this.ticker.add(() => {
      this.world.Step(timeStep, velocityIterations, positionIterations, particleIterations)
    })

    this.renderer.view.addEventListener('click', (event) => {
      const x = event.clientX - window.innerWidth / 2
      const y = event.clientY - window.innerHeight / 2
      this.applyLinearImpulse(x, y)
    })
    this.renderer.view.addEventListener('touchstart', (event) => {
      const x = event.touches[0].clientX - window.innerWidth / 2
      const y = event.touches[0].clientY - window.innerHeight / 2
      this.applyLinearImpulse(x, y)
    })
  }

  applyLinearImpulse(x, y) {
    const length = Math.sqrt(x*x + y*y)
    const count = this.particleGroup.GetParticleCount()
    x *= clickImpulse / length * count
    y *= clickImpulse / length * count
    this.particleGroup.ApplyLinearImpulse(new Box2D.b2Vec2(x, y))
  }

  createBoundingBox() {
    const bd = new Box2D.b2BodyDef()
    bd.set_position(new Box2D.b2Vec2(0, 0))
    const boundingbox = this.world.CreateBody(bd)

    const x = this.renderer.width / 2 / PTM
    const y = this.renderer.height / 2 / PTM
    const shape = new Box2D.b2EdgeShape()

    shape.Set(new Box2D.b2Vec2(-x, -y), new Box2D.b2Vec2(-x, y))
    boundingbox.CreateFixture(shape, 0.0)
    shape.Set(new Box2D.b2Vec2(-x, y), new Box2D.b2Vec2(x, y))
    boundingbox.CreateFixture(shape, 0.0)
    shape.Set(new Box2D.b2Vec2(x, y), new Box2D.b2Vec2(x, -y))
    boundingbox.CreateFixture(shape, 0.0)
    shape.Set(new Box2D.b2Vec2(x, -y), new Box2D.b2Vec2(-x, -y))
    boundingbox.CreateFixture(shape, 0.0)
  }

  spawnRain() {
    const x = (Math.random() - 0.5) * this.renderer.width
    const pd = new Box2D.b2ParticleDef()
    pd.set_position(new Box2D.b2Vec2(x / PTM, -this.renderer.height / 2 / PTM))
    pd.set_velocity(new Box2D.b2Vec2(0, 1))
    this.particleSystemSprite.particleSystem.CreateParticle(pd)
  }

  createParticleSystem() {
    const psd = new Box2D.b2ParticleSystemDef()
    psd.set_radius(particleRadius)
    const particleSystem = this.world.CreateParticleSystem(psd)
    particleSystem.SetMaxParticleCount(maxParticleCount)
    this.particleSystemSprite = new LiquidfunSprite(particleSystem)
    this.stage.addChild(this.particleSystemSprite)
  }

  spawnParticles(radius, x, y) {
    const pgd = new Box2D.b2ParticleGroupDef()
    const shape = new Box2D.b2CircleShape()

    shape.set_m_radius(radius)
    shape.set_m_p(new Box2D.b2Vec2(x, y))
    pgd.set_shape(shape)

    const group = this.particleSystemSprite.particleSystem.CreateParticleGroup(pgd)
    return group
  }
}

// Singleton
export default new App({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: false,
  backgroundColor : backgroundColor
})
