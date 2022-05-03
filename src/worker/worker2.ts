// this worker calculates collision between enemy and player

import consts from '../type/const'
import { SabSet } from './sabManage'

let life: Int32Array
let lock: Int32Array

const lastExecuted = Date.now()
const delta = 0
const now = 0
const stepTime = 0
let running = false

let port: MessagePort

let loopInterval: number

/** Interface of shared array */
export declare interface Isa {
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
  autoAttack1Positions: {
    x: Float64Array,
    y: Float64Array,
  }
  life: Int32Array,
}

export let sa: Isa

onmessage = (ev) => {
  if (ev.data.cmd === 'stop') {
    running = false
  } else if (ev.data.cmd === 'start') {
    running = true
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
      autoAttack1Positions: {
        x: new Float64Array(tempSab.autoAttack1Positions.x),
        y: new Float64Array(tempSab.autoAttack1Positions.y)
      },
      life: new Int32Array(tempSab.life)

    }
    port = ev.ports[0]

    port.onmessage = calc
  }
}

let tempIterator = 0
let playerX = 0; let playerY = 0
let enemyX = 0; let enemyY = 0
let diffX = 0; let diffY = 0
let directionX = 0; let directionY = 0
let distance = 0

const divide = 30
let count = 0
const calc = () => {
  if (running === false) return

  count++
  if (count === divide) {
    count = 0
  }

  tempIterator = consts.numberOfEnemy1
  playerX = sa.playerPosition.x[0]
  playerY = sa.playerPosition.y[0]
  for (tempIterator = count; tempIterator < consts.numberOfEnemy1; tempIterator += divide) {
    if (sa.enemy1Hps[tempIterator] <= 0) continue // skip dead enemy

    enemyX = sa.enemy1Positions.x[tempIterator]
    enemyY = sa.enemy1Positions.y[tempIterator]
    diffX = playerX - enemyX
    diffY = playerY - enemyY
    distance = Math.sqrt(diffX * diffX + diffY * diffY)

    if (distance < 2) {
      self.postMessage({ cmd: 'hitText', x: (playerX + enemyX) / 2, y: (playerY + enemyY) / 2 })
    }

    directionX = (consts.enemy1speed * diffX) / distance
    directionY = (consts.enemy1speed * diffY) / distance

    sa.enemy1Directions.x[tempIterator] = directionX
    sa.enemy1Directions.y[tempIterator] = directionY
  }
}

postMessage({ cmd: 'ready' })
