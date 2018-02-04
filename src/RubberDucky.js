import { Graphics } from 'pixi.js'
import App from './App'

export default class RubberDucky extends Graphics {
  constructor(x, y) {
    super()
    this.position.set(x, y)
    this.createBody(x, y)
    this.draw()

    App.ticker.add(() => {
      let pos = this.body.GetPosition()
      this.position.set(pos.get_x(), pos.get_y())
      this.rotation = this.body.GetAngle()
    })
  }

  createBody(x, y) {
    const bd = new Box2D.b2BodyDef()
    bd.set_type(2)
    bd.set_position(new Box2D.b2Vec2(x,y))
    const duck = App.world.CreateBody(bd)

    const head = new Box2D.b2CircleShape()
    head.set_m_p(new Box2D.b2Vec2(13, -13))
    head.set_m_radius(18)
    duck.CreateFixture(head, 0.01)

    const frontBody = new Box2D.b2CircleShape()
    frontBody.set_m_p(new Box2D.b2Vec2(6, 13))
    frontBody.set_m_radius(21)
    duck.CreateFixture(frontBody, 0.2)

    const backBody = new Box2D.b2CircleShape()
    backBody.set_m_p(new Box2D.b2Vec2(-14, 13))
    backBody.set_m_radius(21)
    duck.CreateFixture(backBody, 0.2)

    this.body = duck
  }

  draw() {
    this.beginFill(0xffffff)
    // duckhead
    this.drawCircle(13, -13, 18)
    // duckbody
    this.drawEllipse(-4, 13, 34.5, 23)
    // ducktail
    this.drawEllipse(-33, 4.5, 7, 16)

    const duckupperlip = new Graphics()
    duckupperlip.beginFill(0xffffff)
    duckupperlip.drawEllipse(0, 0, 7, 4)
    duckupperlip.rotation = - Math.PI / 9
    duckupperlip.position.set(33, -16)
    this.addChild(duckupperlip)

    const ducklowerlip = new Graphics()
    ducklowerlip.beginFill(0xffffff)
    ducklowerlip.drawEllipse(0, 0, 7, 4)
    ducklowerlip.rotation = + Math.PI / 9
    ducklowerlip.position.set(33, -10)
    this.addChild(ducklowerlip)
  }
}
