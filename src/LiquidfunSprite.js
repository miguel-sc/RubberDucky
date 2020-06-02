import { Container, glCore, WebGLRenderer } from "pixi.js";
import App from "./App";
import LiquidfunRenderer from "./LiquidfunRenderer";

export default class LiquidfunSprite extends Container {
  constructor(particleSystem) {
    super();
    this.particleSystem = particleSystem;

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

    const identity_vert = `
    attribute vec2 position;

    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }`;

    const blur_frag = `
    precision mediump float;

    uniform sampler2D base;
    uniform vec2 scale;
    uniform vec2 dir;

    void main() {
      vec2 p = gl_FragCoord.xy / scale;
      vec2 sdir = dir / scale;
      gl_FragColor =
        texture2D(base, p + sdir * vec2(-9.0, -9.0)) * 0.02433 +
        texture2D(base, p + sdir * vec2(-8.0, -8.0)) * 0.03081 +
        texture2D(base, p + sdir * vec2(-7.0, -7.0)) * 0.03795 +
        texture2D(base, p + sdir * vec2(-6.0, -6.0)) * 0.04546 +
        texture2D(base, p + sdir * vec2(-5.0, -5.0)) * 0.05297 +
        texture2D(base, p + sdir * vec2(-4.0, -4.0)) * 0.06002 +
        texture2D(base, p + sdir * vec2(-3.0, -3.0)) * 0.06615 +
        texture2D(base, p + sdir * vec2(-2.0, -2.0)) * 0.07090 +
        texture2D(base, p + sdir * vec2(-1.0, -1.0)) * 0.07392 +
        texture2D(base, p + sdir * vec2( 0.0,  0.0)) * 0.07495 +
        texture2D(base, p + sdir * vec2( 1.0,  1.0)) * 0.07392 +
        texture2D(base, p + sdir * vec2( 2.0,  2.0)) * 0.07090 +
        texture2D(base, p + sdir * vec2( 3.0,  3.0)) * 0.06615 +
        texture2D(base, p + sdir * vec2( 4.0,  4.0)) * 0.06002 +
        texture2D(base, p + sdir * vec2( 5.0,  5.0)) * 0.05297 +
        texture2D(base, p + sdir * vec2( 6.0,  6.0)) * 0.04546 +
        texture2D(base, p + sdir * vec2( 7.0,  7.0)) * 0.03795 +
        texture2D(base, p + sdir * vec2( 8.0,  8.0)) * 0.03081 +
        texture2D(base, p + sdir * vec2( 9.0,  9.0)) * 0.02433;
    }`;

    const threshold_frag = `
    precision mediump float;

    uniform sampler2D base;
    uniform vec2 scale;
    uniform float threshold;
    uniform vec4 color;

    void main() {
      vec4 value = texture2D(base, gl_FragCoord.xy / scale);
      if (value.r > threshold) {
        gl_FragColor = color;
      } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
    }`;

    this.ball_shader = new glCore.GLShader(
      App.renderer.gl,
      ball_vert,
      ball_frag
    );
    this.blur_shader = new glCore.GLShader(
      App.renderer.gl,
      identity_vert,
      blur_frag
    );
    this.threshold_shader = new glCore.GLShader(
      App.renderer.gl,
      identity_vert,
      threshold_frag
    );
    this.pos_buffer = App.renderer.gl.createBuffer();
    this.color_buffer = App.renderer.gl.createBuffer();
    this.quadbuffer = App.renderer.gl.createBuffer();
  }

  _renderWebGL(renderer) {
    renderer.setObjectRenderer(renderer.plugins.liquidfun);
    renderer.plugins.liquidfun.render(this);
  }
}

WebGLRenderer.registerPlugin(LiquidfunRenderer.pluginName, LiquidfunRenderer);
