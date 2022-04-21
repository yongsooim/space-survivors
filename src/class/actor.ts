import * as PIXI from 'pixi.js'

export declare class Actor extends PIXI.Sprite {
  public hp: number
  public speed: number
  update(delta: number) : void
  kill() : void
  add() : void
}
