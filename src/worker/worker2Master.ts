import Worker from './worker2?worker'
import sabWorker1 from './sabManage'
import { aaPool } from '../weapon/autoAttack1'

const myWorker = new Worker()

// myWorker.onmessage = (ev) => {
//  aaPool.disable(ev.data )
// }
setTimeout(() => {
  myWorker.postMessage([sabWorker1.autoAttack1Positions, sabWorker1.autoAttack1Enabled, sabWorker1.enemy1Positions, sabWorker1.enemy1Hps, sabWorker1.playerPosition])
}, 1000)

window.onbeforeunload = function (e) {
  location.reload()
  document.location.reload()
  myWorker.postMessage({ cmd: 'close' })
  myWorker.terminate()
}

window.onclose = function (e) {
  myWorker.postMessage({ cmd: 'close' })
  myWorker.terminate()
}

window.document.addEventListener('beforeunload', (e) => {
  myWorker.postMessage({ cmd: 'close' })
  myWorker.terminate()
})

export {}
