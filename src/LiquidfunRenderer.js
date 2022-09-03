import { ObjectRenderer, utils } from "pixi.js";
import { PTM, spriteColor, blurRadius, blurThreshold } from "./Constants";
import App from "./App";

function highest2(v) {
  // compute the next highest power of 2 of 32-bit v
  v--;
  v |= v >> 1;
  v |= v >> 2;
  v |= v >> 4;
  v |= v >> 8;
  v |= v >> 16;
  v++;
  return v;
}

export default class LiquidfunRenderer extends ObjectRenderer {
  constructor(renderer) {
    super(renderer);
    this.renderer = renderer;
    this.quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    this.textures = null;
    this.blurRadius = blurRadius;
    this.threshold = blurThreshold;
    const rgb = utils.hex2rgb(spriteColor);
    this.rgba = rgb.concat([1.0]);

    window.addEventListener(
      "resize",
      () => {
        this.textures = null;
      },
      false
    );
  }

  swap() {
    const gl = this.renderer.gl;
    const temp = this.textures.front;
    this.textures.front = this.textures.back;
    this.textures.back = temp;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.bindTexture(gl.TEXTURE_2D, this.textures.back);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.textures.back,
      0
    );
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindTexture(gl.TEXTURE_2D, this.textures.front);
  }

  texScale() {
    return new Float32Array([
      highest2(this.renderer.width),
      highest2(this.renderer.height),
    ]);
  }

  createTexture(gl) {
    const tex = gl.createTexture();
    const scale = this.texScale();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      scale[0],
      scale[1],
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    return tex;
  }

  render(sprite) {
    const renderer = this.renderer;
    const gl = renderer.gl;

    renderer.bindVao(null);
    renderer._activeShader = null;
    renderer.bindTexture(null, 0, true);

    if (this.textures === null) {
      this.textures = {};
      this.fbo = gl.createFramebuffer();
      this.textures.front = this.createTexture(gl);
      this.textures.back = this.createTexture(gl);
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    const count = sprite.particleSystem.GetParticleCount();
    const radius = sprite.particleSystem.GetRadius();

    if (count > 0) {
      const w = gl.canvas.width;
      const h = gl.canvas.height;

      // start with ball shader
      sprite.ball_shader.bind();

      /* Position Buffer */
      // get pointer
      const pos_offset = sprite.particleSystem.GetPositionBuffer();
      // read memory into JS Array
      const raw_pos = new Float32Array(
        App.box2D.HEAPU8.buffer,
        App.box2D.getPointer(pos_offset),
        count * 2
      );
      // initalize new Array for corrected values
      let position = new Float32Array(count * 2);
      // transform physics engine coords to renderer coords
      for (let i = 0; i < count; i++) {
        position[i * 2] = (raw_pos[i * 2] * PTM * 2) / w;
        position[i * 2 + 1] = (-raw_pos[i * 2 + 1] * PTM * 2) / h;
      }
      // upload data to gpu
      gl.bindBuffer(gl.ARRAY_BUFFER, sprite.pos_buffer);
      gl.bufferData(gl.ARRAY_BUFFER, position, gl.DYNAMIC_DRAW);

      const positionHandle = sprite.ball_shader.attributes.position.location;
      gl.enableVertexAttribArray(positionHandle);
      gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 0, 0);

      this.swap();
      gl.bindTexture(gl.TEXTURE_2D, this.textures.front);

      sprite.ball_shader.uniforms.size = radius * this.blurRadius * PTM;
      gl.drawArrays(gl.POINTS, 0, count);
      this.swap();

      gl.bindBuffer(gl.ARRAY_BUFFER, sprite.quadbuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this.quad, gl.DYNAMIC_DRAW);

      sprite.blur_shader.bind();
      const blurPositionHandle =
        sprite.blur_shader.attributes.position.location;
      gl.enableVertexAttribArray(blurPositionHandle);
      gl.vertexAttribPointer(positionHandle, 2, gl.FLOAT, false, 0, 0);
      sprite.blur_shader.uniforms.base = 0;
      sprite.blur_shader.uniforms.scale = this.texScale();

      sprite.blur_shader.uniforms.dir = new Float32Array([0.0, 0.5]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      this.swap();

      sprite.blur_shader.uniforms.dir = new Float32Array([0.5, 0.0]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      this.swap();

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      sprite.threshold_shader.bind();
      const thresholdPositionHandle =
        sprite.threshold_shader.attributes.position.location;
      gl.vertexAttribPointer(thresholdPositionHandle, 2, gl.FLOAT, false, 0, 0);
      sprite.threshold_shader.uniforms.base = 0;
      sprite.threshold_shader.uniforms.scale = this.texScale();
      sprite.threshold_shader.uniforms.threshold = this.threshold;
      sprite.threshold_shader.uniforms.color = new Float32Array(this.rgba);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }
}

LiquidfunRenderer.pluginName = "liquidfun";
