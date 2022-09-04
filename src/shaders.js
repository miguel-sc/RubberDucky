export const circleVertexSrc = `
attribute vec2 position;
uniform float size;
uniform vec2 scale;

void main() {
  gl_Position = vec4(position * scale, 0.0, 1.0);
  gl_PointSize = size;
}`;

export const circleFragmentSrc = `
precision mediump float;

void main() {
  if (distance(vec2(0.0, 0.0), gl_PointCoord.xy - 0.5) < 0.5) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  } else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
}`;

export const thresholdFragmentSrc = `
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
