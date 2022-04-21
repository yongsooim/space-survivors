// Util for shared array buffer between main thread and worker thread
import { numberOfEnemy1 } from '../type/const'
import * as PIXI from 'pixi.js'
import Box2DFactory from 'box2d-wasm' // ....

const sizeOfElement = Float64Array.BYTES_PER_ELEMENT // js uses 8 byte for number

class SabWorker1 {
  public sabToPixi = [ // all enemy1 positions, plan to double buffered
    new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfEnemy1 * 2), // multiplied by 2 for 2 elements : [x, y]
    new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfEnemy1 * 2)
  ]
  public arrToPixi = [  // owned by worker thread
    new Float64Array(this.sabToPixi[0]), 
    new Float64Array(this.sabToPixi[1]), 
  ]
  public arrOfPixi = new Array<Float64Array>(2) // owned by main thread

  // player position array [x, y]
  public sabToBox2D = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * 2) // player position, no double buffer
  public arrToBox2D = new Float64Array(this.sabToBox2D) // owned by worker thread
  public arrOfBox2D = new Float64Array(2) // owned by main thread

  mutateSabToPixi (dest: PIXI.Sprite[], src: number[], length: number, slot: number) {
    for (let i = 0; i < length; i++) {
    }

    const sharedBuffer = new SharedArrayBuffer(sizeOfElement * numberOfEnemy1)
    const sharedArray = new Float64Array(sharedBuffer)
  }

  mutateSabToBox2D (dest: Box2D.b2Body[], src: number[], length: number, slot: number) {

  }

  copyPosToRenderer (dest: PIXI.Sprite[], src: number[], length: number) {
    for (let i = 0; i < length; i += 2) {
      dest[i].x = src[i]
      dest[i].y = src[i + 1]
    }
  }

  copyEnabledToBox2D (dest: Box2D.b2Body[], src: number[], length: number) {
    for (let i = 0; i < length; i++) {
      dest[i].SetEnabled(src[i] !== 0)
    }
  }
}

 const sabWorker1 = new SabWorker1()

 export default sabWorker1
