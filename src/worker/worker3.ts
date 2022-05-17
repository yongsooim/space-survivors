// this worker calculates the interaction between resource and player

import Box2DFactory from 'box2d-wasm' // ....
import consts from '../type/const'
import { SabSet } from './sabManage'

// timer for loop
let loopInterval = 0

let running = false

/** Interface of shared array */
export declare interface Isa {
  playerPosition: {
    x: Float64Array;
    y: Float64Array;
  };
  resource1Positions: {
    x: Float64Array;
    y: Float64Array;
  };
  resource1RemainTimes: Int32Array;
  resource1Sleep: Int32Array;
  resource2Positions: {
    x: Float64Array;
    y: Float64Array;
  };
  resource2RemainTimes: Int32Array;
  exp: Int32Array;
  resource2Rotations: Float64Array
}
export let sa: Isa

onmessage = (ev) => {
  if (ev.data.cmd === 'stop') {
    running = false
    // pause
  } else if (ev.data.cmd === 'start') {
    running = true
  } else if (ev.data.cmd === 'close') {
    running = false
    self.close()
  } else if (ev.data.cmd === 'generate') {
    // to filled
  } else if (ev.data.cmd === 'init') {
    const sab = ev.data.sab as SabSet
    sa = {
      // setting shared arrays
      playerPosition: {
        x: new Float64Array(sab.playerPosition.x),
        y: new Float64Array(sab.playerPosition.y)
      },
      resource1Positions: {
        x: new Float64Array(sab.resource1Positions.x),
        y: new Float64Array(sab.resource1Positions.y)
      },
      resource1RemainTimes: new Int32Array(sab.resource1RemainTimes),
      resource1Sleep: new Int32Array(sab.resource1Sleep),
      resource2Positions: {
        x: new Float64Array(sab.resource2Positions.x),
        y: new Float64Array(sab.resource2Positions.y)
      },
      resource2RemainTimes: new Int32Array(sab.resource2RemainTimes),
      exp: new Int32Array(sab.exp),
      resource2Rotations: new Float64Array(sab.resource2Rotations)

    }
    init()
  }
}

function init () {
  for (let i = 0; i < consts.numberOfResource1; i++) {
    sa.resource1Positions.x[i] = (Math.random() - 0.5) * consts.resource1SpawnSize
    sa.resource1Positions.y[i] = (Math.random() - 0.5) * consts.resource1SpawnSize
  }

  for (let i = 0; i < consts.numberOfResource2; i++) {
    sa.resource2Positions.x[i] = (Math.random() - 0.5) * consts.resource2SpawnSize
    sa.resource2Positions.y[i] = (Math.random() - 0.5) * consts.resource2SpawnSize
    sa.resource2Rotations[i] = Math.random() * Math.PI * 2
  }
}

let tempIterator

const counter = 0
let lastExecuted = Date.now()
let delta = 0
let now = Date.now()
let stepTime = 0

let tempPlayerPosX = 0
let tempPlayerPosY = 0
let diffX = 0
let diffY = 0
let distance = 0

const loop = () => {
  if (running === false) return

  let isGet = false

  const postContent = {
    cmd : 'move',
    move1List: [],
    move2List: []
  }

  tempPlayerPosX = sa.playerPosition.x[0]
  tempPlayerPosY = sa.playerPosition.y[0]

  for (let i = counter; i < consts.numberOfResource1; i++) {
    sa.resource1RemainTimes[i] -= delta
    if (sa.resource1RemainTimes[i] <= 0) continue
    diffX = tempPlayerPosX - sa.resource1Positions.x[i]
    diffY = tempPlayerPosY - sa.resource1Positions.y[i]
    distance = Math.sqrt(diffX ** 2 + diffY ** 2)

    if (distance < consts.getRange) {
      sa.resource1Positions.x[i] = consts.nowhere
      sa.resource1Positions.y[i] = consts.nowhere

      sa.resource1RemainTimes[i] = 0
      sa.exp[0] += 1
      postContent.move1List.push(i)
      isGet = true
    } else if (distance < consts.magnetRange) {
      sa.resource1Sleep[i] = 0
      sa.resource1Positions.x[i] += (diffX * (consts.magnetRange - distance) * delta) / 1000
      sa.resource1Positions.y[i] += (diffY * (consts.magnetRange - distance) * delta) / 1000
      postContent.move1List.push(i)
    }
  }

  for (let i = counter; i < consts.numberOfResource2; i++) {
    sa.resource2RemainTimes[i] -= delta
    if (sa.resource2RemainTimes[i] <= 0) continue
    diffX = tempPlayerPosX - sa.resource2Positions.x[i]
    diffY = tempPlayerPosY - sa.resource2Positions.y[i]
    distance = Math.sqrt(diffX * diffX + diffY * diffY)

    sa.resource2Rotations[i] += 0.02

    if (distance < consts.getRange) {
      sa.resource2Positions.x[i] = consts.nowhere
      sa.resource2Positions.y[i] = consts.nowhere

      sa.resource2RemainTimes[i] = 0
      sa.exp[0] += 1
      postContent.move2List.push(i)
      isGet = true
    } else if (distance < consts.magnetRange) {
      sa.resource2Positions.x[i] += (diffX * (consts.magnetRange - distance) * delta) / 1000
      sa.resource2Positions.y[i] += (diffY * (consts.magnetRange - distance) * delta) / 1000
      postContent.move2List.push(i)
    }
  }

  if(postContent.move1List.length === 0){
    delete postContent.move1List
  }

  if(postContent.move2List.length === 0){
    delete postContent.move2List
  }

  if(Object.keys(postContent).length !== 0) {
    postMessage(postContent)
  }

  if(isGet) {
    postMessage({cmd:'get'})
  }
  
  now = Date.now()
  delta = now - lastExecuted

  if (delta > consts.worker3Interval + 5) {
    if (delta > 500) {
      stepTime = 500
    } else {
      stepTime = delta
    }
  } else {
    stepTime = consts.worker3Interval
  }

  lastExecuted = now
}

setTimeout(() => {
  loopInterval = setInterval(loop, consts.worker3Interval)
}, 1000)

postMessage('ready')

export default Worker
