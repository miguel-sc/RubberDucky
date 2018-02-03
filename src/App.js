import { Application, Texture, Sprite } from 'pixi.js'
import LiquidfunSprite from './LiquidfunSprite'

class App extends Application {
  constructor(options) {
    super(options)
    this.renderer.render(this.stage)
    const gravity = new Box2D.b2Vec2(0, 400)
    this.world = new Box2D.b2World(gravity)
    this.sprites = []
    this.stage.position.set(window.innerWidth / 2, window.innerHeight / 2)
  }

  init() {
    this.createParticleSystem()
    this.spawnParticles(100, 0, 0)
    //console.log(this.particleSystemSprite.particleSystem.GetParticleCount())

    this.createBoundingBox()

    this.ticker.add(() => {
      this.spawnRain()
      this.update()
    })
    /*this.ticker.add(() => {
      for (let i=0,s=this.sprites[i];i<this.sprites.length;s=this.sprites[++i]) {
        let pos = s.body.GetPosition()
        s.position.set(pos.get_x(), pos.get_y())
        s.rotation = s.body.GetAngle()
      }
    })*/
  }

  update() {
    this.world.Step(1/60, 8, 3, 3)
  }

  createBoundingBox() {
    const bd = new Box2D.b2BodyDef()
    bd.set_position(new Box2D.b2Vec2(0, 0))
    const boundingbox = this.world.CreateBody(bd)

    const x = this.renderer.width / 2
    const y = this.renderer.height / 2
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
    pd.set_position(new Box2D.b2Vec2(x, -this.renderer.height / 2))
    this.particleSystemSprite.particleSystem.CreateParticle(pd)
  }

  createBox(x, y, w, h, fixed) {
    const bd = new Box2D.b2BodyDef()
    if (!fixed) {
      bd.set_type(2)
    }
    bd.set_position(new Box2D.b2Vec2(x, y))

    const body = this.world.CreateBody(bd)

    const shape = new Box2D.b2PolygonShape
    shape.SetAsBox(w, h)
    body.CreateFixture(shape, 0.5)

    const sprite = Sprite.from(Texture.WHITE)
    // dunno why this has to be times 2
    sprite.width = w * 2
    sprite.height = h * 2
    sprite.anchor.set(0.5)
    sprite.body = body
    this.stage.addChild(sprite)
    this.sprites.push(sprite)
    return body
  }

  createParticleSystem() {
    const psd = new Box2D.b2ParticleSystemDef()
    psd.set_radius(2.0)
    const particleSystem = this.world.CreateParticleSystem(psd)
    particleSystem.SetMaxParticleCount(4000)
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
  backgroundColor : 0x04052E
})
