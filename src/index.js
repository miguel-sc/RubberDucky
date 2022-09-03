import Box2DFactory from "box2d-wasm";
import App from "./App";

function webgl_support() {
  try {
    var canvas = document.createElement("canvas");
    return (
      !!window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

if (webgl_support()) {
  document.body.appendChild(App.view);
  Box2DFactory({
    locateFile: (url) =>
      new URL(
        `../node_modules/box2d-wasm/dist/es/${url}`,
        import.meta.url
      ).toString(),
  }).then((box2D) => {
    App.init(box2D);
  });
}
