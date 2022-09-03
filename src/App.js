import { Application } from "pixi.js";
import LiquidfunSprite from "./LiquidfunSprite";
import RubberDucky from "./RubberDucky";
import {
  backgroundColor,
  particleRadius,
  maxParticleCount,
  PTM,
  timeStep,
  positionIterations,
  velocityIterations,
  particleIterations,
  clickImpulse,
  widthBreakpoint,
  heightBreakpoint,
} from "./Constants";

class App extends Application {
  constructor(options) {
    super(options);
    this.renderer.render(this.stage);
  }

  init(box2D) {
    this.box2D = box2D;
    const gravity = new this.box2D.b2Vec2(0, 9.81);
    this.world = new this.box2D.b2World(gravity);
    this.sprites = [];

    this.ticker.add(() => {
      this.world.Step(
        timeStep,
        velocityIterations,
        positionIterations,
        particleIterations
      );

      for (
        let i = 0, s = this.sprites[i];
        i < this.sprites.length;
        s = this.sprites[++i]
      ) {
        let pos = s.body.GetPosition();
        s.position.set(pos.get_x() * PTM, pos.get_y() * PTM);
        s.rotation = s.body.GetAngle();
      }
    });

    window.addEventListener("resize", () => this.resizeHandler());

    this.renderer.view.addEventListener("click", (event) => {
      const x = event.clientX - window.innerWidth / 2;
      const y = event.clientY - window.innerHeight / 2;
      this.applyLinearImpulse(x, y);
    });

    this.renderer.view.addEventListener("touchstart", (event) => {
      const x = event.touches[0].clientX - window.innerWidth / 2;
      const y = event.touches[0].clientY - window.innerHeight / 2;
      this.applyLinearImpulse(x, y);
    });

    this.initScene();
  }

  initScene() {
    this.stage.position.set(window.innerWidth / 2, window.innerHeight / 2);

    this.createParticleSystem();
    if (
      window.innerWidth > widthBreakpoint &&
      window.innerHeight > heightBreakpoint
    ) {
      this.particleGroup = this.spawnParticles(1.15, 0, 0);
    } else {
      this.particleGroup = this.spawnParticles(0.76, 0, 0);
    }

    this.boundingbox = this.createBoundingBox();
    this.rubberDucky = new RubberDucky(
      0,
      this.renderer.height / 2 - 0.17 * PTM
    );
    this.sprites.push(this.rubberDucky);
    this.stage.addChild(this.rubberDucky);
  }

  resizeHandler() {
    this.destroyAll();
    this.renderer.resize(window.innerWidth, window.innerHeight);
    this.initScene();
  }

  destroyAll() {
    for (
      let i = 0, s = this.sprites[i];
      i < this.sprites.length;
      s = this.sprites[++i]
    ) {
      this.world.DestroyBody(s.body);
      s.destroy();
    }
    this.world.DestroyBody(this.boundingbox);
    this.world.DestroyParticleSystem(this.particleSystemSprite.particleSystem);
    this.particleSystemSprite.destroy();
    this.sprites = [];
  }

  applyLinearImpulse(x, y) {
    const length = Math.sqrt(x * x + y * y);
    const count = this.particleGroup.GetParticleCount();
    x *= (clickImpulse / length) * count;
    y *= (clickImpulse / length) * count;
    this.particleGroup.ApplyLinearImpulse(new this.box2D.b2Vec2(x, y));
  }

  createBoundingBox() {
    const bd = new this.box2D.b2BodyDef();
    bd.set_position(new this.box2D.b2Vec2(0, 0));
    const boundingbox = this.world.CreateBody(bd);

    const x = this.renderer.width / 2 / PTM;
    const y = this.renderer.height / 2 / PTM;
    const shape = new this.box2D.b2EdgeShape();

    shape.SetTwoSided(
      new this.box2D.b2Vec2(-x, -y),
      new this.box2D.b2Vec2(-x, y)
    );
    boundingbox.CreateFixture(shape, 0.0);
    shape.SetTwoSided(
      new this.box2D.b2Vec2(-x, y),
      new this.box2D.b2Vec2(x, y)
    );
    boundingbox.CreateFixture(shape, 0.0);
    shape.SetTwoSided(
      new this.box2D.b2Vec2(x, y),
      new this.box2D.b2Vec2(x, -y)
    );
    boundingbox.CreateFixture(shape, 0.0);
    shape.SetTwoSided(
      new this.box2D.b2Vec2(x, -y),
      new this.box2D.b2Vec2(-x, -y)
    );
    boundingbox.CreateFixture(shape, 0.0);
    return boundingbox;
  }

  createParticleSystem() {
    const psd = new this.box2D.b2ParticleSystemDef();
    psd.set_radius(particleRadius);
    const particleSystem = this.world.CreateParticleSystem(psd);
    particleSystem.SetMaxParticleCount(maxParticleCount);
    this.particleSystemSprite = new LiquidfunSprite(particleSystem);
    this.stage.addChild(this.particleSystemSprite);
  }

  spawnParticles(radius, x, y) {
    const pgd = new this.box2D.b2ParticleGroupDef();
    const shape = new this.box2D.b2CircleShape();

    shape.set_m_radius(radius);
    shape.set_m_p(new this.box2D.b2Vec2(x, y));
    pgd.set_shape(shape);

    const group = this.particleSystemSprite.particleSystem.CreateParticleGroup(
      pgd
    );
    return group;
  }
}

// Singleton
export default new App({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: false,
  backgroundColor: backgroundColor,
});
