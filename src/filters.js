import { utils, Filter } from "pixi.js";
import { spriteColor, blurThreshold } from "./Constants";
import { thresholdFragmentSrc } from "./shaders";

const rgb = utils.hex2rgb(spriteColor);
const rgba = rgb.concat([1.0]);

export const thresholdFilter = new Filter(undefined, thresholdFragmentSrc, {
  color: new Float32Array(rgba),
  threshold: blurThreshold,
});
