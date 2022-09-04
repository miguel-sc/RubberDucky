import {
  Mesh,
  Geometry,
  Texture,
  Program,
  MeshMaterial,
  Buffer,
  DRAW_MODES,
  TYPES,
  Point,
} from "pixi.js";
import { PTM, blurRadius } from "./Constants";
import { circleFragmentSrc, circleVertexSrc } from "./shaders";

export class LiquidfunMesh extends Mesh {
  constructor(particleSystem) {
    super(
      new Geometry(),
      new MeshMaterial(Texture.WHITE, {
        program: Program.from(circleVertexSrc, circleFragmentSrc),
        uniforms: {
          size: particleSystem.GetRadius() * blurRadius * PTM,
          scale: new Point(
            (PTM * 2) / window.innerWidth,
            (PTM * 2) / window.innerHeight
          ),
        },
      }),
      null,
      DRAW_MODES.POINTS
    );

    this.particleSystem = particleSystem;

    const positionArray = new Float32Array(
      particleSystem.GetParticleCount() * 2
    );
    const positionBuffer = new Buffer(positionArray, false, false);

    this.geometry.addAttribute(
      "position",
      positionBuffer,
      2,
      false,
      TYPES.FLOAT
    );
  }

  render(r) {
    this.geometry.buffers.forEach((e) => e.update());

    super.render(r);
  }
}
