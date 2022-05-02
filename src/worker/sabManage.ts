// Util for shared array buffer between main thread and worker thread
import consts from "../type/const";

export class SabSet {

  /** postfix Arr is for array used in main */
  
  timerSab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
  timerArr = new Int32Array(this.timerSab);

  expSab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
  expArr = new Int32Array(this.expSab);

  killSab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
  killArr = new Int32Array(this.killSab);

  lifeSab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
  lifeArr = new Int32Array(this.lifeSab);

  lockSab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
  lockArr = new Int32Array(this.lockSab);

  playerPosition = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * 2);
  playerPositionArr = new Float64Array(this.playerPosition);

  enemy1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy1* 2);
  enemy1PositionsArr = new Float64Array(this.enemy1Positions);

  enemy1Directions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy1 * 2); // not used in main
  
  enemy1Hps = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfEnemy1);
  enemy1HpsArr = new Int32Array(this.enemy1Hps);

  autoAttack1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfAutoAttack1 * 2);
  autoAttack1PositionsArr = new Float64Array(this.autoAttack1Positions);

  autoAttack1Enabled = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfAutoAttack1);
  autoAttack1EnabledArr = new Int32Array(this.autoAttack1Enabled);

  flame1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfAutoAttack1 * 2);
  flame1PositionsArr = new Float64Array(this.flame1Positions);

  flame1Enabled = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfAutoAttack1);
  flame1EnabledArr = new Int32Array(this.flame1Enabled);

  resource1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfResource1 * 2);
  resource1PositionsArr = new Float64Array(this.resource1Positions);

  resource1RemainTimes = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfResource1);
  resource2RemainTimes = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfResource2);

  resource2Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfResource2 * 2);
  resource2PositionsArr = new Float64Array(this.resource2Positions);

  resource1RemainTimesArr = new Int32Array(this.resource1RemainTimes);
  resource2RemainTimesArr = new Int32Array(this.resource2RemainTimes);
  
  weapon1Positions = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfWeapon1 * 2);
  weapon1Enabled = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfWeapon1);

}

const sab = new SabSet();

export default sab;
