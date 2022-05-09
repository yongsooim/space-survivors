// this worker calculates collision between enemy and player
// and calculates (subtract) remain time of objects

import consts from '../type/const'
import { SabSet } from './sabManage'

let running = false

let port: MessagePort

let loopInterval: number

let tempIterator = 0

/** Interface of shared array */
declare interface Isa {
  playerPosition: {
    x: Float64Array,
    y: Float64Array,
  }
  enemy1Positions: {
    x: Float64Array,
    y: Float64Array,
  }
  enemy1Directions: {
    x: Float64Array,
    y: Float64Array,
  }
  enemy1Hps: Int32Array,
  enemy2Positions: {
    x: Float64Array,
    y: Float64Array,
  }
  enemy2Directions: {
    x: Float64Array,
    y: Float64Array,
  }
  enemy2Hps: Int32Array,
  enemy3Positions: {
    x: Float64Array,
    y: Float64Array,
  }
  enemy3Directions: {
    x: Float64Array,
    y: Float64Array,
  }
  enemy3Hps: Int32Array,
  autoAttack1Positions: {
    x: Float64Array,
    y: Float64Array,
  }
  autoAttack1RemainTimes: Int32Array,
  
  flame1Positions: {
    x: Float64Array,
    y: Float64Array,
  }
  flame1RemainTimes: Int32Array
  life: Int32Array,
}

export let sa: Isa

onmessage = (ev) => {
  if (ev.data.cmd === 'stop') {
    running = false
    clearInterval(loopInterval)
  } else if (ev.data.cmd === 'start') {
    running = true
    //loopInterval = setInterval(calc, consts.worker2Interval)
  } else if (ev.data.cmd === 'close') {
    running = false
    clearInterval(loopInterval)
    self.close()
  } else if (ev.data.cmd === 'init') {
    console.log(ev.data)
    const tempSab = ev.data.sab as SabSet
    sa = {
      playerPosition: {
        x: new Float64Array(tempSab.playerPosition.x),
        y: new Float64Array(tempSab.playerPosition.y)
      },
      enemy1Positions: {
        x: new Float64Array(tempSab.enemy1Positions.x),
        y: new Float64Array(tempSab.enemy1Positions.y)
      },
      enemy1Directions: {
        x: new Float64Array(tempSab.enemy1Directions.x),
        y: new Float64Array(tempSab.enemy1Directions.y)
      },
      enemy1Hps: new Int32Array(tempSab.enemy1Hps),
      enemy2Positions: {
        x: new Float64Array(tempSab.enemy2Positions.x),
        y: new Float64Array(tempSab.enemy2Positions.y)
      },
      enemy2Directions: {
        x: new Float64Array(tempSab.enemy2Directions.x),
        y: new Float64Array(tempSab.enemy2Directions.y)
      },
      enemy2Hps: new Int32Array(tempSab.enemy2Hps),
      enemy3Positions: {
        x: new Float64Array(tempSab.enemy3Positions.x),
        y: new Float64Array(tempSab.enemy3Positions.y)
      },
      enemy3Directions: {
        x: new Float64Array(tempSab.enemy3Directions.x),
        y: new Float64Array(tempSab.enemy3Directions.y)
      },
      enemy3Hps: new Int32Array(tempSab.enemy3Hps),
      autoAttack1Positions: {
        x: new Float64Array(tempSab.autoAttack1Positions.x),
        y: new Float64Array(tempSab.autoAttack1Positions.y)
      },

      autoAttack1RemainTimes: new Int32Array(tempSab.autoAttack1RemainTimes),
      flame1Positions: {
        x: new Float64Array(tempSab.flame1Positions.x),
        y: new Float64Array(tempSab.flame1Positions.y)
      },

      flame1RemainTimes: new Int32Array(tempSab.flame1RemainTimes),
      life: new Int32Array(tempSab.life)

    }
    port = ev.ports[0]

    port.onmessage = calc
  }
}

let playerX = 0, enemyX = 0, diffX = 0, directionX = 0
let playerY = 0, enemyY = 0, diffY = 0, directionY = 0
let distance = 0

const divide = 30
let count = 0
const calc = () => {
  if (running === false) return
  count++
  if (count >= divide) {
    count = 0
  }

  playerX = sa.playerPosition.x[0]
  playerY = sa.playerPosition.y[0]

  tempIterator = consts.numberOfEnemy1
  while (tempIterator--) {
    if (sa.enemy1Hps[tempIterator] <= 0) continue // skip dead enemy

    enemyX = sa.enemy1Positions.x[tempIterator]
    enemyY = sa.enemy1Positions.y[tempIterator]
    diffX = playerX - enemyX
    diffY = playerY - enemyY
    distance = Math.sqrt(diffX ** 2 + diffY ** 2)

    directionX = (consts.enemy1speed * diffX) / distance
    directionY = (consts.enemy1speed * diffY) / distance

    sa.enemy1Directions.x[tempIterator] = directionX
    sa.enemy1Directions.y[tempIterator] = directionY

    if(tempIterator % 30 === count){
      if (distance < 2) {
        self.postMessage({ cmd: 'hitText', x: (playerX + enemyX) / 2, y: (playerY + enemyY) / 2 });
      }
    }
  }

  tempIterator = consts.numberOfEnemy2
  while (tempIterator--) {
    if (sa.enemy2Hps[tempIterator] <= 0) continue // skip dead enemy

    enemyX = sa.enemy2Positions.x[tempIterator]
    enemyY = sa.enemy2Positions.y[tempIterator]
    diffX = playerX - enemyX
    diffY = playerY - enemyY
    distance = Math.sqrt(diffX ** 2 + diffY ** 2)

    directionX = (consts.enemy2speed * diffX) / distance
    directionY = (consts.enemy2speed * diffY) / distance

    sa.enemy2Directions.x[tempIterator] = directionX
    sa.enemy2Directions.y[tempIterator] = directionY

    if(tempIterator % 30 === count){
      if (distance < 2) {
        self.postMessage({ cmd: 'hitText', x: (playerX + enemyX) / 2, y: (playerY + enemyY) / 2 });
      }
    }
  }



  tempIterator = consts.numberOfAutoAttack1
  while (tempIterator--) { // should it be atomic? maybe?
    if (sa.autoAttack1RemainTimes[tempIterator] > 0) {
      sa.autoAttack1RemainTimes[tempIterator] -= consts.worker2Interval
    }
  }
  tempIterator = consts.numberOfFlame1
  while (tempIterator--) { // should it be atomic? maybe?
    if (sa.flame1RemainTimes[tempIterator] > 0) {
      sa.flame1RemainTimes[tempIterator] -= consts.worker2Interval
    }
  }

}

postMessage({ cmd: 'ready' })
