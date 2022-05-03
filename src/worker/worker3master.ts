import * as PIXI from 'pixi.js'
import Worker from './worker3?worker'
import consts from '../type/const'
import { viewport, viewportContainer } from '../viewport/viewport'
import particlePng from '../asset/particle.png'
import { player } from '../player/player'
import sab from './sabManage'

import { textures } from '../resource/spriteManage'
import { app } from '../main'
import { sound } from '@pixi/sound'
const worker3 = new Worker()

sound.volume('pickup', 0.2)

worker3.onmessage = (ev) => {
  if (ev.data.cmd === 'get') {
    sound.play('pickup')
  }
}

const resource1container = new PIXI.ParticleContainer(
  consts.numberOfResource1,
  {
    alpha: true,
    position: true
  },
  consts.numberOfResource1,
  false
)

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

let tempIterator = 0

export function worker3init () {
  let resource1sprites
  tempIterator = consts.numberOfResource1
  while (tempIterator--) {
    resource1sprites = new PIXI.Sprite(textures.particles[Math.floor(Math.random() * 15.9)])
    resource1sprites.scale.set(0.04)
    resource1sprites.anchor.set(0.5)
    resource1sprites.tint = 0x964b00
    resource1sprites.alpha = 0
    resource1container.addChild(resource1sprites)
  }

  let resource2sprite
  tempIterator = consts.numberOfResource2
  while (tempIterator--) {
    resource2sprite = new PIXI.Sprite(textures.resource2)
    resource2sprite.scale.set(0.1)
    resource2sprite.anchor.set(0.5)
    resource2sprite.rotation = Math.random() * Math.PI * 2
    resource2sprite.alpha = 0
    resource2sprite.x = Math.random() * 100 - 50
    resource2sprite.y = Math.random() * 100 - 50
    resource2container.addChild(resource2sprite)
  }

  worker3.postMessage({cmd: 'init', sab: sab})

  tempIterator = consts.numberOfResource1
  while (tempIterator--) {
    sab.resource1RemainTimesArr[tempIterator] = 10000000
  }

  tempIterator = consts.numberOfResource2
  while (tempIterator--) {
    sab.resource2RemainTimesArr[tempIterator] = 20000000
  }

  tempIterator = consts.numberOfResource1
  while (tempIterator--) {
    resource1container.children[tempIterator].x = sab.resource1PositionsArr.x[tempIterator]
    resource1container.children[tempIterator].y = sab.resource1PositionsArr.y[tempIterator]
    resource1container.children[tempIterator].alpha = 0.5
  }

  tempIterator = consts.numberOfResource2
  while (tempIterator--) {
    resource2container.children[tempIterator].x = sab.resource2PositionsArr.x[tempIterator]
    resource2container.children[tempIterator].y = sab.resource2PositionsArr.y[tempIterator]
    resource2container.children[tempIterator].alpha = 0.3
  }

  app.ticker.add(() => {
    tempIterator = consts.numberOfResource1
    while (tempIterator--) {
      if (sab.resource1RemainTimesArr[tempIterator] <= 0) {
        resource1container.children[tempIterator].alpha = 0
        continue
      }

      if (sab.resource1RemainTimesArr[tempIterator] <= 1000) {
        resource1container.children[tempIterator].alpha = 0.1
      } else if (sab.resource1RemainTimesArr[tempIterator] <= 2000) {
        resource1container.children[tempIterator].alpha = 0.15
      } else if (sab.resource1RemainTimesArr[tempIterator] <= 3000) {
        resource1container.children[tempIterator].alpha = 0.2
      } else if (sab.resource1RemainTimesArr[tempIterator] <= 4000) {
        resource1container.children[tempIterator].alpha = 0.3
      } else if (sab.resource1RemainTimesArr[tempIterator] <= 5000) {
        resource1container.children[tempIterator].alpha = 0.4
      }

      resource1container.children[tempIterator].x = sab.resource1PositionsArr.x[tempIterator]
      resource1container.children[tempIterator].y = sab.resource1PositionsArr.y[tempIterator]
    }

    tempIterator = consts.numberOfResource2
    while (tempIterator--) {
      if (sab.resource2RemainTimesArr[tempIterator] <= 0) {
        resource2container.children[tempIterator].alpha = 0
        continue
      }

      if (sab.resource2RemainTimesArr[tempIterator] <= 1000) {
        resource2container.children[tempIterator].alpha = 0.1
      } else if (sab.resource2RemainTimesArr[tempIterator] <= 2000) {
        resource2container.children[tempIterator].alpha = 0.15
      } else if (sab.resource2RemainTimesArr[tempIterator] <= 3000) {
        resource2container.children[tempIterator].alpha = 0.2
      } else if (sab.resource2RemainTimesArr[tempIterator] <= 4000) {
        resource2container.children[tempIterator].alpha = 0.3
      } else if (sab.resource2RemainTimesArr[tempIterator] <= 5000) {
        resource2container.children[tempIterator].alpha = 0.4
      }

      resource2container.children[tempIterator].rotation += 0.02
      resource2container.children[tempIterator].x = sab.resource2PositionsArr.x[tempIterator]
      resource2container.children[tempIterator].y = sab.resource2PositionsArr.y[tempIterator]
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
  worker3.terminate()
}

window.onclose = function () {
  worker3.postMessage({ cmd: 'close' })
  worker3.terminate()
}

window.document.addEventListener('beforeunload', () => {
  worker3.postMessage({ cmd: 'close' })
  worker3.terminate()
})
