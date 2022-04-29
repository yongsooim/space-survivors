//calculate vector towards player

import { enemy1speed, numberOfEnemy1 } from '../type/const'

let playerPosition: Float64Array
let enemy1positions: Float64Array
let enemy1direction: Float64Array
let life: Int32Array

onmessage = (ev) => {
  if (ev.data.cmd === 'calc') {
    calculate()
  }
  else {
    playerPosition = new Float64Array(ev.data[0].playerPosition)
    enemy1positions = new Float64Array(ev.data[0].enemy1Positions)
    life = new Int32Array(ev.data[0].lifeSab)
    enemy1direction = new Float64Array(ev.data[1])
  }
}

let tempIterator = 0
let tempIteratorDouble = 0
let tempPlayerPosX = 0
let tempPlayerPosY = 0
let diffX = 0
let diffY = 0
let length = 0

let now
let diff
function calculate() {
  now = Date.now()
  tempPlayerPosX = playerPosition[0]
  tempPlayerPosY = playerPosition[1]
  tempIterator = numberOfEnemy1
  while(tempIterator--){
    tempIteratorDouble = tempIterator * 2
    diffX = tempPlayerPosX - enemy1positions[tempIteratorDouble]
    diffY = tempPlayerPosY - enemy1positions[tempIteratorDouble + 1]
    length = Math.sqrt(diffX * diffX + diffY * diffY)
 
    enemy1direction[tempIteratorDouble] = enemy1speed * diffX / length
    enemy1direction[tempIteratorDouble + 1] = enemy1speed * diffY / length

    if(length < 2){
      Atomics.sub(life, 0, 1)
    }
  }

  
  diff = Date.now() - now
  if(diff > 1)
    console.log(diff)
}
