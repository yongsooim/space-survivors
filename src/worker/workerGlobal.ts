export declare interface Isa {
  playerPosition: { x: Float64Array; y: Float64Array };
  enemy1Positions: { x: Float64Array; y: Float64Array };
  enemy1Directions: { x: Float64Array; y: Float64Array };
  autoAttack1Positions: { x: Float64Array; y: Float64Array };
  flame1Positions: { x: Float64Array; y: Float64Array };
  enemy1Hps: Int32Array;
  autoAttack1Enabled: Int32Array;
  flame1Enabled: Int32Array;
  kills: Int32Array;
}

export enum Filter {
  Enemy1 = 0x0001,
  AutoAttack1 = 0x0002,
  Player = 0x0004,
  Flame = 0x0008,
}

