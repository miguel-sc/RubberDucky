import { Application } from 'pixi.js'

class App extends Application {
  constructor(options) {
    super(options)
    this.renderer.render(this.stage)
  }
}

// Singleton
export default new App({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: false,
  backgroundColor : 0x04052E
})
