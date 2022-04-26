import * as PIXI from 'pixi.js'
import { resources } from './resource/resources'
import { beatInit } from './timer/beatManage'
import { player } from './player/player'
import { input } from './input/input'
import { worker1init } from './worker/worker1master'
import { tileInit } from './tile/tile'
import { aaPool } from './weapon/autoAttack1'
import { enemy1update } from './worker/worker1master'
import { initViewport, viewport, viewportUpdate } from './viewport/viewport'
import { initStat } from './stat/stat'
import isMobile from 'is-mobile'

PIXI.utils.skipHello()
PIXI.settings.GC_MAX_CHECK_COUNT = 20000
PIXI.settings.GC_MAX_IDLE = 80000
PIXI.settings.GC_MODE = PIXI.GC_MODES.MANUAL
PIXI.settings.FILTER_MULTISAMPLE = PIXI.MSAA_QUALITY.NONE
PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.LOW
PIXI.settings.PRECISION_VERTEX = PIXI.PRECISION.LOW
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL2

export const app = new PIXI.Application({
  view: document.getElementById('pixi') as HTMLCanvasElement,
  resizeTo: window,
  antialias: false,
  backgroundColor: 0x000000,
  //autoDensity: true
})

document.body.appendChild(app.view)

app.loader.add(resources).load(async () => {
  initStat()
  initViewport()
  input.init()
  tileInit()
  viewport.addChild(player)
  worker1init()
  aaPool.init()
  beatInit()

  // Listen for frame updates
  app.ticker.add((delta: number) => {
    input.update()
    player.update(delta)
    aaPool.update(delta)
    viewportUpdate(delta)
  })
})

// Set the name of the hidden property and the change event for visibility
let hidden: string, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
  // @ts-ignore
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
  // @ts-ignore
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}
function handleVisibilityChange() {
  // @ts-ignore
  if (document[hidden]) {
    //console.log('hidden')
    if (isMobile() === true) {
      // stop workers
    }
  } else {
    //console.log('show')
    if (isMobile() === true) {
      // start workers
    }
  }
}

document.addEventListener(visibilityChange as string, handleVisibilityChange, false);
