import './index.css'
import './favicon.ico'
import './lib/liquidfun/liquidfun.min.js'
import App from './App'
import LightningSprite from './LightningSprite'

document.body.appendChild(App.view)
App.init()
new LightningSprite()
