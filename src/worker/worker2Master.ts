import Worker from './worker2?worker'
import sab from './sabManage'
import { aaPool } from '../weapon/autoAttack1'
import { channel12 } from './channel'
import { sound } from '@pixi/sound'
import { player } from '../player/player'
import { damageTextPool } from '../ui/damageText'

const worker2 = new Worker()
sound.volume('playerhit', 0.2)
worker2.onmessage = (ev) => {
  if (ev.data.cmd === 'ready') {
    worker2.postMessage({ cmd: 'init', sab: sab }, [channel12.port2])
  } else if (ev.data.cmd === 'hitText') {
    Atomics.sub(sab.lifeArr, 0, 3)
    sound.play('playerhit')
    damageTextPool.playerhit(ev.data.x, ev.data.y, 3)

    player.hit()
  }
}

export function worker2start () {
  worker2.postMessage({ cmd: 'start' })
}

window.onbeforeunload = function (e) {
  location.reload()
  document.location.reload()
  worker2.postMessage({ cmd: 'close' })
}

window.onclose = function (e) {
  worker2.postMessage({ cmd: 'close' })
}

window.document.addEventListener('beforeunload', (e) => {
  worker2.postMessage({ cmd: 'close' })
})

export {}

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

    worker2.postMessage({ cmd: 'stop' })
    console.log('hidden')
  } else {
    // console.log('show')
    worker2.postMessage({ cmd: 'start' })
  }
}

document.addEventListener(visibilityChange as string, handleVisibilityChange, false)
