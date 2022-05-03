import * as PIXI from 'pixi.js'
import { resources } from './resource/resources'
import { beatInit } from './timer/beatMaster'
import { player } from './player/player'
import { input } from './input/input'
import { worker1init, worker1Ready, worker1start } from './worker/worker1master'
import { worker2start } from './worker/worker2master'
import { worker3init, worker3start } from './worker/worker3master'
import { PixiConsole, PixiConsoleConfig } from 'pixi-console'
import { mainMenu } from './scene/mainMenu'


import { initViewport, viewport, viewportContainer } from './viewport/viewport'
import { initStat } from './stat/stat'
import { addText } from './ui/ui'
import { bgInit } from './tile/background'
import { tileInit } from './tile/tile'
import { aaPool } from './weapon/autoAttack1'
import { renderUpdate } from './render/render'

PIXI.utils.skipHello()
PIXI.settings.FILTER_MULTISAMPLE = PIXI.MSAA_QUALITY.NONE
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL2

export const app = new PIXI.Application({
  view: document.getElementById('pixi') as HTMLCanvasElement,
  resizeTo: window,
  antialias: false,
  backgroundColor: 0x000000,
  autoDensity: true
})

let resourceLoadDone = false
document.body.appendChild(app.view)

app.loader.onProgress.add((e) => {
  // console.log(e);
})
app.loader.onComplete.add((e) => {
  console.log('loading done')
  resourceLoadDone = true
})
app.loader.onError.add((e) => {
  console.log('ERROR: ' + e.message)
})

//
//const consoleConfig = new PixiConsoleConfig();
//consoleConfig.consoleWidth = 800;
//consoleConfig.consoleHeight = 600;
// 
//const pixiConsole = new PixiConsole(consoleConfig);
//app.stage.addChild(pixiConsole);
// 
////const secondConsole = new PixiConsole(consoleConfig); // Error PixiConsole is singleton..
//pixiConsole == PixiConsole.getInstance(); // true

app.loader.add(resources).load(() => {
  // initStat()

  bgInit()
  initViewport()
  
  mainMenu.init()
  viewportContainer.addChild(mainMenu)
  
  input.init()

  
  worker1init()
  
  worker3init()

  let count = 0
  let started = false
  app.ticker.add((delta: number) => {
    count++

    if (count >= 180 && worker1Ready && started === false) {
      started = true
      mainMenu.exit()

      aaPool.init()
      addText()
      player.init()
      viewport
        .pinch({ noDrag: true })
        .wheel({ percent: 0, smooth: 10, trackpadPinch: true })
        .setZoom(20)
        .clampZoom({ minScale: 1, maxScale: 500 })
        .follow(player)
      viewportContainer.addChild(player)
      worker2start()
      worker3start()
      beatInit()
      app.ticker.add((delta: number) => {
        input.update()
        aaPool.update(delta)
        player.update(delta)
        renderUpdate()
      })

    }
  })
})

// Set the name of the hidden property and the change event for visibility
let hidden: string, visibilityChange
if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden'
  visibilityChange = 'visibilitychange'
  // @ts-ignore
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden'
  visibilityChange = 'msvisibilitychange'
  // @ts-ignore
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden'
  visibilityChange = 'webkitvisibilitychange'
}

function handleVisibilityChange () {
  // @ts-ignore
  if (document[hidden]) {
    // console.log('hidden')
    if (PIXI.isMobile.any === true) {
      // stop workers
    }
  } else {
    // console.log('show')
    if (PIXI.isMobile.any === true) {
      // start workers
    }
  }
}

document.addEventListener(visibilityChange as string, handleVisibilityChange, false)

document.addEventListener(
  'scroll',
  (e) => {
    e.preventDefault()
  },
  false
)
