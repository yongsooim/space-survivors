//Util for shared array buffer between main thread and worker thread
import { numberOfEnemy1 } from "../type/const"
import * as PIXI from 'pixi.js'
import Box2DFactory from "box2d-wasm"; // ....

const sizeOfElement = Float64Array.BYTES_PER_ELEMENT // js uses 8 byte for number

console.log(sizeOfElement)

class sabUtil {
  public sabToPixi = [
    new SharedArrayBuffer(sizeOfElement * numberOfEnemy1 * 2),  // multiplied by 2 for 2 elements : [x, y]
    new SharedArrayBuffer(sizeOfElement * numberOfEnemy1 * 2)
  ]
  public sabToBox2d = [
    new SharedArrayBuffer(sizeOfElement * numberOfEnemy1),
    new SharedArrayBuffer(sizeOfElement * numberOfEnemy1)
  ]

  public s32ArrToPixi = new ArrayBuffer(sizeOfElement * numberOfEnemy1 * 2)
  public s32ArrToBox2d = new ArrayBuffer(sizeOfElement * numberOfEnemy1)

  public arrToPixi = new Float64Array()
  public arrToBox2d = new Float64Array()

  mutateSabToPixi(dest: PIXI.Sprite[], src: number[], length: number, slot: number) {
    for (let i = 0; i < length; i++) {
      this.arrToPixi[i] = src[i]
    }

    const sharedBuffer = new SharedArrayBuffer(sizeOfElement * numberOfEnemy1);
    const sharedArray = new Float64Array(sharedBuffer);
  }


  mutateSabToBox2D(dest: Box2D.b2Body[], src: number[], length: number, slot: number) {

  }

  copyPosToRenderer(dest: PIXI.Sprite[], src: number[], length: number) {
    for (let i = 0; i < length; i += 2) {
      dest[i].x = src[i]
      dest[i].y = src[i + 1]
    }
  }

  copyEnabledToBox2D(dest: Box2D.b2Body[], src: number[], length: number) {
    for (let i = 0; i < length; i++) {
      dest[i].SetEnabled(src[i] === 0 ? false : true)
    }
  }
}
