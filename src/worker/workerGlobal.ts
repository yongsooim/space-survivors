/** Interface of shared array */
export declare interface Isa {
  playerPosition: { x: Float64Array; y: Float64Array },
  enemy1Positions: { x: Float64Array; y: Float64Array },
  enemy1Directions: { x: Float64Array; y: Float64Array },
  enemy1Hps: Int32Array,
  enemy2Positions: { x: Float64Array; y: Float64Array },
  enemy2Directions: { x: Float64Array; y: Float64Array },
  enemy2Hps: Int32Array,
  enemy3Positions: { x: Float64Array; y: Float64Array },
  enemy3Directions: { x: Float64Array; y: Float64Array },
  enemy3Hps: Int32Array,
  autoAttack1Positions: { x: Float64Array; y: Float64Array },
  autoAttack1RemainTimes: Int32Array,
  flame1Positions: { x: Float64Array; y: Float64Array },
  flame1RemainTimes: Int32Array,
  missile1Positions: { x: Float64Array; y: Float64Array },
  missile1RemainTimes: Int32Array,
  kills: Int32Array
}

export enum Filter {
  Enemy1 = 0x0001,
  Enemy2 = 0x0002,
  Enemy3 = 0x0004,
  AutoAttack1 = 0x0010,
  Flame = 0x0020,
  Missile1 = 0x0040,
  Player = 0x8000,
}
