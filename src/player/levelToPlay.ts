
import { player } from '../player/player'
import { sound } from '@pixi/sound'

export function playBeat(beatCounter: number){

  // 0o00 ~ 0o77

  if(player.level >= 0) {
    switch(beatCounter){
      case 0o00:
      case 0o10:
      case 0o20:
      case 0o30:
      case 0o40:
      case 0o50:
      case 0o60:
      case 0o70:
        sound.play('kick')
        player.fire() 
    }
  }

  
  if(player.level >= 1) {
    switch(beatCounter){
      case 0o04:
      case 0o14:
      case 0o24:
      case 0o34:
      case 0o44:
      case 0o54:
      case 0o64:
      case 0o74:
        sound.play('kick')
        player.fire() 
    }
  }


  switch (player.level) {
    case 0:
      break

    case 1:
      switch(beatCounter){
        case 0:

          break
        case 0o4:
          sound.play('kick')
          player.fire()  
          break
      }
      break

    case 2:
      break

    case 3:
      break

    case 4:
      break
    
  }

}