import { Application, Texture, Sprite } from 'pixi.js'
import LiquidfunSprite from './LiquidfunSprite'

class App extends Application {
  constructor(options) {
    super(options)
    this.renderer.render(this.stage)
    let gravity = new Box2D.b2Vec2(0, 100)
    this.world = new Box2D.b2World(gravity)
    this.sprites = []
  }

  init() {
    this.createParticleSystem()
    this.spawnParticles(50, 0, 0)
    //console.log(this.particleSystemSprite.particleSystem.GetParticleCount())
    this.ticker.add(() => this.update())

    this.createBox(0,300,1000,10,true)
    this.createBox(200,300,10,1000,true)
    this.createBox(-200,300,10,1000,true)

    this.ticker.add(() => {
      for (let i=0,s=this.sprites[i];i<this.sprites.length;s=this.sprites[++i]) {
        let pos = s.body.GetPosition()
        s.position.set(pos.get_x() + window.innerWidth / 2, pos.get_y() + window.innerHeight / 2)
        s.rotation = s.body.GetAngle()
      }
    })
  }

  update() {
    this.world.Step(1/60, 8, 3)
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
