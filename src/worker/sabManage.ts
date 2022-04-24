// Util for shared array buffer between main thread and worker thread
import { numberOfEnemy1, numberOfEnemy1double, numberOfWeapon1, numberOfWeapon1double, numberOfResource1, numberOfResource1double, numberOfAutoAttack1 } from '../type/const'
import * as PIXI from 'pixi.js'
import Box2DFactory from 'box2d-wasm' // ....

const sizeOfElement = Float64Array.BYTES_PER_ELEMENT // js uses 8 byte for number

//
// dynamic values
// enemy1 positions
// weapon positions
// player positions
// resource positions
// bullet weapon positions
// damage dealt?
// 

// 1. SharedArrayBuffer
// 2. TypedArray(SharedArrayBuffer) used in main

class SabWorker1 {
  public playerPosition = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * 2)

  public enemy1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfEnemy1double)
  public enemy1Hps = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfEnemy1)

  public autoAttack1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfAutoAttack1 * 2)
  public autoAttack1ReaminTimes = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfAutoAttack1)

  public weapon1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfWeapon1double)
  public weapon1Enabled = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfWeapon1)

  public resource1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfResource1double)
  public resource1Enabled = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfResource1)

  /** arrays used in main */
  public playerPositionArr = new Float64Array(this.playerPosition)
  public enemy1PositionsArr = new Float64Array(this.enemy1Positions)
  public enemy1HpsArr = new Float64Array(this.enemy1Hps)
  public autoAttack1PositionsArr = new Float64Array(this.autoAttack1Positions)
  public autoAttack1ReaminTimesArr = new Float64Array(this.autoAttack1ReaminTimes)
}

 const sabWorker1 = new SabWorker1()

 export default sabWorker1
