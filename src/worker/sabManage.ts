// Util for shared array buffer between main thread and worker thread
import consts from '../type/const'

export class SabSet {
  /** postfix Arr is for array used in main */

  timer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
  timerArr = new Int32Array(this.timer);

  exp = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
  expArr = new Int32Array(this.exp);

  kills = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
  killArr = new Int32Array(this.kills);

  life = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
  lifeArr = new Int32Array(this.life);

  playerPosition = {
    x: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT),
    y: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT)
  }
  playerPositionArr = {
    x: new Float64Array(this.playerPosition.x),
    y: new Float64Array(this.playerPosition.y)
  }

  enemy1Positions = {
    x: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy1),
    y: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy1)
  }
  enemy1PositionsArr = {
    x: new Float64Array(this.enemy1Positions.x),
    y: new Float64Array(this.enemy1Positions.y)
  }

  enemy1Directions = { // published by worker2, subscribed by worker1
    x: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy1),
    y: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy1)
  }

  enemy1Hps = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfEnemy1);
  enemy1HpsArr = new Int32Array(this.enemy1Hps);

  enemy2Positions = {
    x: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy2),
    y: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy2)
  }
  enemy2PositionsArr = {
    x: new Float64Array(this.enemy2Positions.x),
    y: new Float64Array(this.enemy2Positions.y)
  }

  enemy2Directions = { // published by worker2, subscribed by worker1
    x: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy2),
    y: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy2)
  }

  enemy2Hps = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfEnemy2);
  enemy2HpsArr = new Int32Array(this.enemy2Hps);

  
  enemy3Positions = {
    x: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy3),
    y: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy3)
  }
  enemy3PositionsArr = {
    x: new Float64Array(this.enemy3Positions.x),
    y: new Float64Array(this.enemy3Positions.y)
  }

  enemy3Directions = { // published by worker2, subscribed by worker1
    x: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy3),
    y: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfEnemy3)
  }

  enemy3Hps = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfEnemy3);
  enemy3HpsArr = new Int32Array(this.enemy3Hps);

  autoAttack1Positions = {
    x: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfAutoAttack1),
    y: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfAutoAttack1)
  }
  autoAttack1PositionsArr = {
    x: new Float64Array(this.autoAttack1Positions.x),
    y: new Float64Array(this.autoAttack1Positions.y)
  }

  autoAttack1RemainTimes = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfAutoAttack1);
  autoAttack1RemainTimesArr = new Int32Array(this.autoAttack1RemainTimes);

  flame1Positions = {
    x: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfFlame1),
    y: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfFlame1)
  }

  flame1PositionsArr = {
    x: new Float64Array(this.flame1Positions.x),
    y: new Float64Array(this.flame1Positions.y)
  }

  flame1RemainTimes = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfFlame1);
  flame1RemainTimesArr = new Int32Array(this.flame1RemainTimes);

  
  missile1Positions = {
    x: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfMissile1),
    y: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfMissile1)
  }

  missile1PositionsArr = {
    x: new Float64Array(this.missile1Positions.x),
    y: new Float64Array(this.missile1Positions.y)
  }

  missile1RemainTimes = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfMissile1);
  missile1RemainTimesArr = new Int32Array(this.missile1RemainTimes);

  resource1Positions = {
    x: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfResource1),
    y: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfResource1)
  }
  resource1PositionsArr = {
    x: new Float64Array(this.resource1Positions.x),
    y: new Float64Array(this.resource1Positions.y)
  }

  resource1RemainTimes = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfResource1);
  resource1RemainTimesArr = new Int32Array(this.resource1RemainTimes);

  resource1Sleep = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfResource1);
  resource1SleepArr = new Int32Array(this.resource1Sleep);

  resource2Positions = {
    x: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfResource2),
    y: new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfResource2)
  }
  resource2PositionsArr = {
    x: new Float64Array(this.resource2Positions.x),
    y: new Float64Array(this.resource2Positions.y)
  }
  resource2Rotations = new SharedArrayBuffer(Float64Array.BYTES_PER_ELEMENT * consts.numberOfResource2)
  resource2RotationsArr = new Float64Array(this.resource2Rotations)
  
  resource2RemainTimes = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * consts.numberOfResource2);
  resource2RemainTimesArr = new Int32Array(this.resource2RemainTimes);

  constructor(){

    for(let i = 0 ; i < consts.numberOfResource1 ; i++){
      this.resource1SleepArr[i] = 1
    }
  }
}

const sab = new SabSet()

export default sab
