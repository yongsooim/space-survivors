import { Actor, vec } from 'excalibur'
import { Resources } from '../resources'

export class Player extends Actor {
  public hp = 100
  public speed = 100
  public ship = 'frigate'

  constructor () {
    super({
      pos: vec(150, 150),
      width: 100,
      height: 100
    })
  }

  onInitialize () {
    this.graphics.add(Resources.Sword.toSprite())
    this.on('pointerup', () => {
      alert('yo')
    })
  }
}
