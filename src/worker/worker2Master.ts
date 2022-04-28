import Worker from './worker2?worker'
import sab from './sabManage'
import { aaPool } from '../weapon/autoAttack1'

const worker2 = new Worker()

// myWorker.onmessage = (ev) => {
//  aaPool.disable(ev.data )
// }

setTimeout(() => {
  worker2.postMessage([
    sab.autoAttack1Positions,
    sab.autoAttack1Enabled,
    sab.enemy1Positions,
    sab.enemy1Hps,
    sab.killSab
  ])
}, 1000)

window.onbeforeunload = function (e) {
  location.reload()
  document.location.reload()
  worker2.postMessage({ cmd: 'close' })
  worker2.terminate()
}

window.onclose = function (e) {
  worker2.postMessage({ cmd: 'close' })
  worker2.terminate()
}

window.document.addEventListener('beforeunload', (e) => {
  worker2.postMessage({ cmd: 'close' })
  worker2.terminate()
})

export {}
