// Util for shared array buffer between main thread and worker thread
import { numberOfEnemy1, numberOfEnemy1double, numberOfWeapon1, numberOfWeapon1double, numberOfResource1, numberOfResource1double, numberOfAutoAttack1, numberOfResource2, numberOfResource2double } from '../type/const'

export class SabSet {
  public timerSab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)
  public resourceCollectedSab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)
  public killSab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)
  public lifeSab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)
  public lockSab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT)

  public playerPosition = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * 2)

  public enemy1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfEnemy1double)
  public enemy1Hps = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * numberOfEnemy1)

  public autoAttack1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfAutoAttack1 * 2)
  public autoAttack1Enabled = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * numberOfAutoAttack1)

  public flame1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfAutoAttack1 * 2)
  public flame1Enabled = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * numberOfAutoAttack1)

  public weapon1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfWeapon1double)
  public weapon1Enabled = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfWeapon1)

  public resource1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfResource1double)
  public resource1RemainTimes = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * numberOfResource1)

  public resource2Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * numberOfResource2double)
  public resource2RemainTimes = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * numberOfResource2)

  /** arrays used in main */
  public playerPositionArr = new Float64Array(this.playerPosition)
  public enemy1PositionsArr = new Float64Array(this.enemy1Positions)
  public enemy1HpsArr = new Int32Array(this.enemy1Hps)
  public autoAttack1PositionsArr = new Float64Array(this.autoAttack1Positions)
  public autoAttack1EnabledArr = new Int32Array(this.autoAttack1Enabled)
  public resource1PositionsArr = new Float64Array(this.resource1Positions)
  public resource1RemainTimesArr = new Int32Array(this.resource1RemainTimes)
  public resource2PositionsArr = new Float64Array(this.resource2Positions)
  public resource2RemainTimesArr = new Int32Array(this.resource2RemainTimes)

  public timerArr = new Int32Array(this.timerSab)
  public resourceCollectedArr = new Int32Array(this.resourceCollectedSab)
  public killArr = new Int32Array(this.killSab)
  public lifeArr = new Int32Array(this.lifeSab)
  public lockArr = new Int32Array(this.lockSab)
}

const sab = new SabSet()

export default sab
