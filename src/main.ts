import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { resources } from './resource/resources'
import { sprites, enemy1 } from './resource/spriteManage'
import Worker from './worker/worker1?worker'
import { numberOfEnemy1 } from './type/const'
import sabWorker1 from './worker/sabManage'
import { beatInit } from './timer/beatManage'
import { player } from './player/player'
import { input } from './input/input'

import Stats from '../node_modules/stats.js/src/Stats.js'
import { aaPool } from './weapon/autoAttack1'
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

function animate () {
  stats.begin()
  stats.end()
  requestAnimationFrame(animate)
}

requestAnimationFrame(animate)

const worker1 = new Worker()

PIXI.utils.skipHello()
PIXI.settings.GC_MAX_CHECK_COUNT = 20000
PIXI.settings.GC_MAX_IDLE = 80000
PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.LOW
PIXI.settings.PRECISION_VERTEX = PIXI.PRECISION.LOW

const app = new PIXI.Application({
  resizeTo: window,
  antialias: false,
  backgroundColor: 0x000000
})

document.body.appendChild(app.view)

export const viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
  disableOnContextMenu: true
})

input.init()
const enemy1ships = [] as PIXI.Sprite[]
let indexDouble

window.addEventListener('resize', () => {
  viewport.resize(window.innerWidth, window.innerHeight)
})

sabWorker1.enemy1HpsArr.forEach((v, i, a) => {
  a[i] = 1
})

let tempIterator: number
app.loader.add(resources).load(async () => {
  const tilingSprite = new PIXI.TilingSprite(sprites.bg.texture, 50000, 50000)
  tilingSprite.scale.x = 0.1
  tilingSprite.scale.y = 0.1
  tilingSprite.anchor.x = 0.5
  tilingSprite.anchor.y = 0.5

  viewport.addChild(tilingSprite)
  aaPool.init()

  viewport.center.x = 250
  viewport.center.y = 250

  viewport
    .pinch({ noDrag: true })
    .wheel({ percent: 0, smooth: 10, trackpadPinch: true })
    .setZoom(0.5)
    .clampZoom({ minScale: 0.5, maxScale: 1000 })
    .follow(player)

  sprites.ship2.x = app.renderer.width / 2
  sprites.ship2.y = app.renderer.height / 2

  sprites.ship2.anchor.x = 0.5
  sprites.ship2.anchor.y = 0.5

  viewport.addChild(sprites.ship2).position.x = 300

  app.stage.addChild(viewport)

  const enemy1container = new PIXI.ParticleContainer(
    numberOfEnemy1,
    {
      vertices: false,
      rotation: false,
      uvs: false,
      tint: false,
      alpha: true,
      scale: false,
      position: true
    },
    numberOfEnemy1,
    false
  )
  viewport.addChild(enemy1container)

  tempIterator = numberOfEnemy1

  while (tempIterator--) {
    enemy1ships[tempIterator] = new PIXI.Sprite(enemy1)

    enemy1ships[tempIterator].scale.x = 0.2
    enemy1ships[tempIterator].scale.y = 0.2

    enemy1ships[tempIterator].anchor.x = 0.5
    enemy1ships[tempIterator].anchor.y = 0.5

    enemy1ships[tempIterator].anchor.set(0.5)
    enemy1ships[tempIterator].x = 9999
    enemy1ships[tempIterator].y = 9999
    enemy1ships[tempIterator].cacheAsBitmapResolution = 1
    enemy1ships[tempIterator].cacheAsBitmap = true
    enemy1container.addChild(enemy1ships[tempIterator])
  }

  viewport.addChild(player)

  beatInit()
  // Listen for frame updates
  app.ticker.add((delta: number) => {
    // enemy1 position update
    tempIterator = numberOfEnemy1
    while (tempIterator--) {
      if (sabWorker1.enemy1HpsArr[tempIterator] <= 0) {
        sabWorker1.enemy1HpsArr[tempIterator] = 0
        enemy1container.children[tempIterator].alpha = 0
        continue
      }
      indexDouble = tempIterator * 2
      enemy1container.children[tempIterator].x = sabWorker1.enemy1PositionsArr[indexDouble]
      enemy1container.children[tempIterator].y = sabWorker1.enemy1PositionsArr[indexDouble + 1]
    }

    input.update()
    player.update(delta)
    aaPool.update(delta)
    sprites.ship2.rotation -= 0.01
  })
})

setInterval(() => {
  // console.log(sabWorker1.enemy1HpsArr)
}, 500)

setTimeout(() => {
  worker1.postMessage([sabWorker1.playerPosition, sabWorker1.enemy1Positions, sabWorker1.enemy1Hps])
}, 1000)

window.onbeforeunload = (e) => {
  location.reload()
  document.location.reload()
  worker1.postMessage({ cmd: 'close' })
  worker1.terminate()
  PIXI.utils.clearTextureCache()
}

//window.onblur = (e) => {
//  worker1.postMessage({ cmd: 'stop' })
//}

window.onclose = () => {
  worker1.postMessage({ cmd: 'close' })
  worker1.terminate()
  PIXI.utils.clearTextureCache()
}

window.document.addEventListener('beforeunload', () => {
  worker1.terminate()
  worker1.postMessage('')
  PIXI.utils.clearTextureCache()
})





// Set the name of the hidden property and the change event for visibility
let hidden: string, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
// @ts-ignore: Unreachable code error
  } else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
// @ts-ignore: Unreachable code error
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

// If the page is hidden, pause the video;
// if the page is shown, play the video
function handleVisibilityChange() {
// @ts-ignore: Unreachable code error
  if (document[hidden]) {
    console.log('hidden')
  } else {
    console.log('show')
  }
}

document.addEventListener(visibilityChange as string, handleVisibilityChange, false);
