import {
  Filter,
  Mesh,
  Geometry,
  Texture,
  Program,
  MeshMaterial,
  Buffer,
  utils,
  DRAW_MODES,
  TYPES,
} from "pixi.js";
import App from "./App";
import { spriteColor, blurThreshold, PTM, blurRadius } from "./Constants";

const ball_vert = `
    attribute vec2 position;
    uniform float size;

    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
      gl_PointSize = size;
    }`;

const ball_frag = `
    precision mediump float;

    void main() {
      if (distance(vec2(0.0, 0.0), gl_PointCoord.xy - 0.5) < 0.5) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
    }`;

const threshold_frag = `
    precision mediump float;

    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    uniform float threshold;
    uniform vec4 color;

    void main() {
      vec4 value = texture2D(uSampler, vTextureCoord);
      if (value.r > threshold) {
        gl_FragColor = color;
      } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
    }`;

const rgb = utils.hex2rgb(spriteColor);
const rgba = rgb.concat([1.0]);

export const threshold_filter = new Filter(undefined, threshold_frag, {
  color: new Float32Array(rgba),
  threshold: blurThreshold,
});

export class LiquidfunMesh extends Mesh {
  constructor(particleSystem) {
    super(
      new Geometry(),
      new MeshMaterial(Texture.WHITE, {
        program: Program.from(ball_vert, ball_frag),
        uniforms: {
          size: particleSystem.GetRadius() * blurRadius * PTM,
        },
      }),
      null,
      DRAW_MODES.POINTS
    );

    this.particleSystem = particleSystem;
    this.max = particleSystem.GetParticleCount();

    const posArray = new Float32Array(this.max * 2);
    const posBuff = new Buffer(posArray, false, false);

    this.geometry.addAttribute("position", posBuff, 2, false, TYPES.FLOAT);
  }

  render(r) {
    const count = this.particleSystem.GetParticleCount();
    const pos_offset = this.particleSystem.GetPositionBuffer();

    const raw_pos = new Float32Array(
      App.box2D.HEAPU8.buffer,
      App.box2D.getPointer(pos_offset),
      count * 2
    );

    let position = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      position[i * 2] = (raw_pos[i * 2] * PTM * 2) / window.innerWidth;
      position[i * 2 + 1] = (raw_pos[i * 2 + 1] * PTM * 2) / window.innerHeight;
    }

    this.geometry.getBuffer("position").update(position);

    super.render(r);
  }
}
