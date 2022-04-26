import Worker from './worker2?worker'
import sabWorker1 from './sabManage'
import { aaPool } from '../weapon/autoAttack1'

const worker3 = new Worker()

// myWorker.onmessage = (ev) => {
//  aaPool.disable(ev.data )
// }
setTimeout(() => {
  worker3.postMessage([
    sabWorker1.autoAttack1Positions, 
    sabWorker1.autoAttack1Enabled, 
    sabWorker1.enemy1Positions, 
    sabWorker1.enemy1Hps, 
    sabWorker1.playerPosition
  ])
}, 1000)

window.onbeforeunload = function (e) {
  location.reload()
  document.location.reload()
  worker3.postMessage({ cmd: 'close' })
  worker3.terminate()
}

window.onclose = function (e) {
  worker3.postMessage({ cmd: 'close' })
  worker3.terminate()
}

window.document.addEventListener('beforeunload', (e) => {
  worker3.postMessage({ cmd: 'close' })
  worker3.terminate()
})

export {}
