import Worker from './worker2?worker'
import sabWorker1 from './sabManage'
import { aaPool } from '../weapon/autoAttack1'

const worker2 = new Worker()

// myWorker.onmessage = (ev) => {
//  aaPool.disable(ev.data )
// }

setTimeout(() => {
  worker2.postMessage([
    sabWorker1.autoAttack1Positions, 
    sabWorker1.autoAttack1Enabled, 
    sabWorker1.enemy1Positions, 
    sabWorker1.enemy1Hps, 
    sabWorker1.killSab
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
