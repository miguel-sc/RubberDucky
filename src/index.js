import "./index.css";
import "./favicon.ico";
import "./lib/liquidfun/liquidfun.min.js";
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
  App.init();
}
