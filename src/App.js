import { Application, Texture, Sprite } from 'pixi.js'
import LiquidfunSprite from './LiquidfunSprite'

class App extends Application {
  constructor(options) {
    super(options)
    this.renderer.render(this.stage)
    let gravity = new Box2D.b2Vec2(0, 200)
    this.world = new Box2D.b2World(gravity)
    this.sprites = []
    this.stage.position.set(window.innerWidth / 2, window.innerHeight / 2)
  }

  init() {
    this.createParticleSystem()
    this.spawnParticles(150, 0, 0)
    //console.log(this.particleSystemSprite.particleSystem.GetParticleCount())
    this.ticker.add(() => this.update())

    this.createBoundingBox()

    /*this.ticker.add(() => {
      for (let i=0,s=this.sprites[i];i<this.sprites.length;s=this.sprites[++i]) {
        let pos = s.body.GetPosition()
        s.position.set(pos.get_x(), pos.get_y())
        s.rotation = s.body.GetAngle()
      }
    })*/
  }

  update() {
    this.world.Step(1/60, 8, 3)
    //this.world.Step(1/60, 8, 3)
  }

  createBoundingBox() {
    const bd = new Box2D.b2BodyDef()
    bd.set_position(new Box2D.b2Vec2(0, 0))
    const boundingbox = this.world.CreateBody(bd)

    const x = this.renderer.width / 2
    const y = this.renderer.height / 2

    const shape = new Box2D.b2EdgeShape()
    shape.Set(new Box2D.b2Vec2(-x, -y),new Box2D.b2Vec2(-x, y))
    boundingbox.CreateFixture(shape, 0.0)
    shape.Set(new Box2D.b2Vec2(-x, y),new Box2D.b2Vec2(x, y))
    boundingbox.CreateFixture(shape, 0.0)
    shape.Set(new Box2D.b2Vec2(x, y),new Box2D.b2Vec2(x, -y))
    boundingbox.CreateFixture(shape, 0.0)
    shape.Set(new Box2D.b2Vec2(x, -y),new Box2D.b2Vec2(-x, -y))
    boundingbox.CreateFixture(shape, 0.0)
  }

  createBox(x, y, w, h, fixed) {
    let bd = new Box2D.b2BodyDef()
    if (!fixed) {
      bd.set_type(2)
    }
    bd.set_position(new Box2D.b2Vec2(x, y))

    let body = this.world.CreateBody(bd)

    let shape = new Box2D.b2PolygonShape
    shape.SetAsBox(w, h)
    body.CreateFixture(shape, 0.5)

    let sprite = Sprite.from(Texture.WHITE)
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
    let psd = new Box2D.b2ParticleSystemDef()
    psd.set_radius(2.0)
    let particleSystem = this.world.CreateParticleSystem(psd)
    particleSystem.SetMaxParticleCount(20000)
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
