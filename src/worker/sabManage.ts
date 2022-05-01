// Util for shared array buffer between main thread and worker thread
import consts from "../type/const";

export class SabSet {

  
  timerSab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
  expSab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
  killSab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
  lifeSab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
  lockSab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);

  playerPosition = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * 2);

  enemy1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy1* 2);
  enemy1Directions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy1 * 2);
  enemy1Hps = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfEnemy1);

  autoAttack1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfAutoAttack1 * 2);
  autoAttack1Enabled = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfAutoAttack1);

  flame1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfAutoAttack1 * 2);
  flame1Enabled = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfAutoAttack1);

  weapon1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfWeapon1 * 2);
  weapon1Enabled = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfWeapon1);

  resource1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfResource1 * 2);
  resource1RemainTimes = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfResource1);

  resource2Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfResource2 * 2);
  resource2RemainTimes = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfResource2);

  /** arrays used in main */
  playerPositionArr = new Float64Array(this.playerPosition);
  enemy1PositionsArr = new Float64Array(this.enemy1Positions);
  enemy1HpsArr = new Int32Array(this.enemy1Hps);
  autoAttack1PositionsArr = new Float64Array(this.autoAttack1Positions);
  autoAttack1EnabledArr = new Int32Array(this.autoAttack1Enabled);
  flame1PositionsArr = new Float64Array(this.flame1Positions);
  flame1EnabledArr = new Int32Array(this.flame1Enabled);
  resource1PositionsArr = new Float64Array(this.resource1Positions);
  resource1RemainTimesArr = new Int32Array(this.resource1RemainTimes);
  resource2PositionsArr = new Float64Array(this.resource2Positions);
  resource2RemainTimesArr = new Int32Array(this.resource2RemainTimes);

  timerArr = new Int32Array(this.timerSab);
  expArr = new Int32Array(this.expSab);
  killArr = new Int32Array(this.killSab);
  lifeArr = new Int32Array(this.lifeSab);
  lockArr = new Int32Array(this.lockSab);
}

const sab = new SabSet();

export default sab;
