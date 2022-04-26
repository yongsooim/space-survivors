import Worker from './beatWorker?worker'
import { sound } from '@pixi/sound'

import { player } from '../player/player'

const heartbeatWorker = new Worker()

sound.volume('kick', 0.05)
sound.volume('hihat', 0.05)
sound.volume('loop', 0.05)
sound.volume('snare', 0.05)
sound.volume('bass', 0.05)

const beatMax = 32
let beatCounter = 0
export function beatInit () {
  heartbeatWorker.onmessage = () => {
    if (++beatCounter >= beatMax) { // can have 0 ~ 31, 4 bar
      beatCounter = 0
    }

    switch (beatCounter) {
    case 0o0: // octal literal
      sound.play('kick')
      sound.play('loop')
      player.fire()

      break

    case 0o1:

      break

    case 0o2:

      break

    case 0o3:

      break

    case 0o4:

      break

    case 0o5:

      break

    case 0o6:

      break

    case 0o7:

      break

    case 0o10:
      sound.play('kick')
      player.fire()

      break

    case 0o11:

      break

    case 0o12:

      break

    case 0o13:

      break

    case 0o14:

      break

    case 0o15:

      break

    case 0o16:

      break

    case 0o17:

      break

    case 0o20:
      sound.play('kick')
      player.fire()

      break

    case 0o21:

      break

    case 0o22:

      break

    case 0o23:

      break

    case 0o24:

      break

    case 0o25:

      break

    case 0o26:

      break

    case 0o27:

      break

    case 0o30:
      sound.play('kick')
      player.fire()

      break

    case 0o31:

      break

    case 0o32:

      break

    case 0o33:

      break

    case 0o34:

      break

    case 0o35:

      break

    case 0o36:

      break

    case 0o37:

      break
    }


    // use counter for sychro actions 
  }

  setTimeout(() => {
    heartbeatWorker.postMessage('start')
  }, 500)
}
