import { Actor, ActorArgs, vec } from 'excalibur'

class Player extends Actor {
  constructor (config?: ActorArgs) {
    super({ ...config, anchor: vec(0, 0) })
  }
}
