import * as PIXI from 'pixi.js'
import Worker from './worker3?worker'
import consts from '../type/const'
import { viewport, viewportContainer } from '../viewport/viewport'
import particlePng from '../asset/particle.png'
import { player } from '../player/player'
import sab from './sabManage'
import { Simple, SpatialHash } from 'pixi-cull'

import { textures } from '../resource/spriteManage'
import { app } from '../main'
import { sound } from '@pixi/sound'
const worker3 = new Worker()

worker3.onmessage = (ev) => {
  if (ev.data.cmd === 'get') {
    sound.volume('pickup', 0.2)
    sound.play('pickup')
  } else if (ev.data.cmd === 'ready') {
    // ready
  }
}

const resource1container = new PIXI.ParticleContainer(
  consts.numberOfResource1,
  {
    tint: false,
    position: true
  },
  consts.numberOfResource1,
  false
)
resource1container.interactiveChildren = false
resource1container.sortableChildren = false
resource1container.interactive = false

const resource2container = new PIXI.ParticleContainer(
  consts.numberOfResource2,
  {
    alpha: true,
    position: true,
    rotation: true
  },
  consts.numberOfResource2,
  false
)
resource2container.interactiveChildren = false
resource2container.sortableChildren = false
resource2container.interactive = false

let tempIterator = 0

export function worker3init () {
  worker3.postMessage({ cmd: 'init', sab: sab })

  let resource1sprites

  tempIterator = consts.numberOfResource1
  while (tempIterator--) {
    resource1sprites = new PIXI.Sprite(textures.particles[Math.floor(Math.random() * 15.9)])
    resource1sprites.scale.set(0.06)
    resource1sprites.anchor.set(0.5)
    resource1sprites.position.x = consts.nowhere
    resource1sprites.position.y = consts.nowhere
    resource1sprites.tint = 0x964b00
    resource1sprites.cacheAsBitmap = false
    resource1container.addChild(resource1sprites)
  }

  let resource2sprite
  tempIterator = consts.numberOfResource2
  while (tempIterator--) {
    resource2sprite = new PIXI.Sprite(textures.resource2)
    resource2sprite.scale.set(0.1)
    resource2sprite.anchor.set(0.5)
    resource2sprite.rotation = Math.random() * Math.PI * 2
    resource2sprite.cacheAsBitmap = false
    resource2container.addChild(resource2sprite)
  }

  tempIterator = consts.numberOfResource1
  while (tempIterator--) {
    sab.resource1RemainTimesArr[tempIterator] = 10000000
  }

  tempIterator = consts.numberOfResource2
  while (tempIterator--) {
    sab.resource2RemainTimesArr[tempIterator] = 20000000
  }

  tempIterator = consts.numberOfResource2
  while (tempIterator--) {
    resource2container.children[tempIterator].x = sab.resource2PositionsArr.x[tempIterator]
    resource2container.children[tempIterator].y = sab.resource2PositionsArr.y[tempIterator]
    resource2container.children[tempIterator].alpha = 0.5
  }

  worker3.addEventListener('message', (ev) => {
    if (ev.data.cmd === 'wakeup') {
      resource1container.children[ev.data.index].position.set(sab.resource1PositionsArr.x[ev.data.index], sab.resource1PositionsArr.y[ev.data.index])
    } else if (ev.data.cmd === 'wakeup2') {
      resource2container.children[ev.data.index].position.set(sab.resource2PositionsArr.x[ev.data.index], sab.resource2PositionsArr.y[ev.data.index])
    }
  })

  tempIterator = consts.numberOfResource1
  while (tempIterator--) {
    resource1container.children[tempIterator].x = sab.resource1PositionsArr.x[tempIterator]
    resource1container.children[tempIterator].y = sab.resource1PositionsArr.y[tempIterator]
    resource1container.children[tempIterator].alpha = 0.5
  }
  app.ticker.add(() => {
    tempIterator = consts.numberOfResource2
    while (tempIterator--) {
      resource2container.children[tempIterator].rotation = sab.resource2RotationsArr[tempIterator]
    }
  })
}

export function worker3start () {
  setTimeout(() => {
    worker3.postMessage({ cmd: 'start' })
    viewportContainer.addChild(resource1container)
    viewportContainer.addChild(resource2container)
  }, 1000)
}

window.onbeforeunload = function () {
  location.reload()
  document.location.reload()
  worker3.postMessage({ cmd: 'close' })
}

window.onclose = function () {
  worker3.postMessage({ cmd: 'close' })
}

window.document.addEventListener('beforeunload', () => {
  worker3.postMessage({ cmd: 'close' })
})
