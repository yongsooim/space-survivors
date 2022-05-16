import Worker from './worker1?worker'
import sab from './sabManage'
import * as PIXI from 'pixi.js'
import { viewport, viewportContainer } from '../viewport/viewport'
import consts from '../type/const'
import { aa1Texture, enemy1, fireTexture, sprites } from '../resource/spriteManage'
import { app } from '../main'
import { sound } from '@pixi/sound'
import { damageTextPool } from '../ui/damageText'
import { channel12 } from './channel'
import { isMobile } from 'pixi.js'
import firePng from '../asset/fire.png'
import { explosion, explosionPool } from '../player/explosion'

const worker1 = new Worker()

const tempIterator = 0

let tempSprite
let alreadySent = false
export let worker1Ready = false
worker1.onmessage = (ev: any) => {
  if (ev.data.cmd === 'loaded') {
    if (alreadySent === false) {
      alreadySent = true
      worker1.postMessage({ cmd: 'init', sab: sab }, [channel12.port1])
      channel12.port1.onmessage = () => {
        channel12.port2.postMessage(0)
      }
    }
  } else if (ev.data.cmd === 'ready') {
    worker1Ready = true
    worker1.postMessage({ cmd: 'start' })
  } else if (ev.data.cmd === 'damage') {
    damageTextPool.show((ev.data.x + ev.data.enemyX) / 2, (ev.data.y + ev.data.enemyY) / 2, ev.data.damage)
    // explosionPool.show(ev.data.enemyX, ev.data.enemyY)
  } else if (ev.data.cmd === 'dead') {
    explosionPool.show(ev.data.enemyX, ev.data.enemyY)
    sound.play('explosion')
  }
}

export function worker1init () {
  // calc request

  worker1start()
}

export function worker1start () {}

window.onbeforeunload = () => {
  location.reload()
  document.location.reload()
  worker1.postMessage({ cmd: 'close' })
  PIXI.utils.clearTextureCache()
}

window.onclose = () => {
  worker1.postMessage({ cmd: 'close' })
  PIXI.utils.clearTextureCache()
}

window.document.addEventListener('beforeunload', () => {
  worker1.postMessage('')
  PIXI.utils.clearTextureCache()
})

export function worker1fire () {
  sound.volume('shot', 0.3)
  sound.play('shot')

  worker1.postMessage({ cmd: 'fire' })
}

export function worker1flame () {
  worker1.postMessage({ cmd: 'flame' })
}

export function worker1missile () {
  worker1.postMessage({ cmd: 'missile' })
}

export async function worker1check () {
  worker1.postMessage({ cmd: 'check' })
}

// Set the name of the hidden property and the change event for visibility
let hidden: string, visibilityChange
if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
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
    worker1.postMessage({ cmd: 'stop' })
  } else {
    // console.log('show')
    worker1.postMessage({ cmd: 'start' })
  }
}

document.addEventListener(visibilityChange as string, handleVisibilityChange, false)

export {}
