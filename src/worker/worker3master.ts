import * as PIXI from 'pixi.js'
import Worker from './worker3?worker'
import { numberOfResource1, numberOfResource2 } from '../type/const'
import { viewport, viewportContainer } from '../viewport/viewport'
import particlePng from '../asset/particle.png'
import { player } from '../player/player'
import sab from './sabManage'

import { textures } from '../resource/spriteManage'
import { app } from '../main'
const worker3 = new Worker()

worker3.onmessage = (ev) => {
  // play resource get sound
}

const resource1container = new PIXI.ParticleContainer(
  numberOfResource1,
  {
    alpha: true,
    position: true
  },
  numberOfResource1,
  false
)

const resource2container = new PIXI.ParticleContainer(
  numberOfResource2,
  {
    alpha: true,
    position: true,
    rotation: true
  },
  numberOfResource2,
  false
)

let tempIterator = 0
let indexDouble = 0

export async function worker3init() {
  let resource1sprites
  tempIterator = numberOfResource1
  while (tempIterator--) {
    resource1sprites = new PIXI.Sprite(textures.particles[Math.floor(Math.random() * 15.9)])
    resource1sprites.scale.set(0.04)
    resource1sprites.anchor.set(0.5)
    resource1sprites.tint = 0x964b00
    resource1sprites.alpha = 0
    resource1container.addChild(resource1sprites)
  }

  let resource2sprite
  tempIterator = numberOfResource2
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

  worker3.postMessage(sab)

  tempIterator = numberOfResource1
  while (tempIterator--) {
    sab.resource1RemainTimesArr[tempIterator] = 10000000
  }

  tempIterator = numberOfResource2
  while (tempIterator--) {
    sab.resource2RemainTimesArr[tempIterator] = 20000000
  }

  tempIterator = numberOfResource1
  while (tempIterator--) {
    resource1container.children[tempIterator].x = sab.resource1PositionsArr[indexDouble]
    resource1container.children[tempIterator].y = sab.resource1PositionsArr[indexDouble + 1]
    resource1container.children[tempIterator].alpha = 0.4
  }

  tempIterator = numberOfResource2
  while (tempIterator--) {
    resource2container.children[tempIterator].x = sab.resource2PositionsArr[indexDouble]
    resource2container.children[tempIterator].y = sab.resource2PositionsArr[indexDouble + 1]
    resource2container.children[tempIterator].alpha = 0.3
  }

  viewportContainer.addChild(resource1container)
  viewportContainer.addChild(resource2container)

  app.ticker.add(() => {
    tempIterator = numberOfResource1
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

      indexDouble = tempIterator * 2

      resource1container.children[tempIterator].x = sab.resource1PositionsArr[indexDouble]
      resource1container.children[tempIterator].y = sab.resource1PositionsArr[indexDouble + 1]
    }

    tempIterator = numberOfResource2
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

      indexDouble = tempIterator * 2

      resource2container.children[tempIterator].rotation += 0.02
      resource2container.children[tempIterator].x = sab.resource2PositionsArr[indexDouble]
      resource2container.children[tempIterator].y = sab.resource2PositionsArr[indexDouble + 1]
    }
  })
  
  setTimeout(()=>{
    worker3.postMessage({cmd:'start'})
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

