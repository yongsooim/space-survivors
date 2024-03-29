import shipPng from '../asset/ship.png'
import bgPng from '../asset/bg.png'
import miscPng from '../asset/misc.png'
import projPng from '../asset/proj.png'
import uiPng from '../asset/ui.png'
import charPng from '../asset/char.png'
import particlePng from '../asset/particle.png'
import particlesPng from '../asset/particles.png'
import playerhit from '../asset/playerhit.wav'
import enemyhitwav from '../asset/enemyhit.wav'
import flamewav from '../asset/flame.wav'
import explosion from '../asset/explosion.wav'
import enemyhit from '../asset/enemyhit.wav'
import firePng from '../asset/fire.png'
import levelup from '../asset/levelup.wav'

import fireWav from '../asset/Laser_Shoot9.wav'
import pickupWav from '../asset/pickup.wav'
import shotWav from '../asset/shot.wav'
import kick from '../asset/kick.wav'
import hihat from '../asset/hihat_close.wav'
import snare from '../asset/snare.wav'
import loop from '../asset/loop.wav'
import loop2 from '../asset/loop2.wav'
import bass from '../asset/bass.wav'
import * as PIXI from 'pixi.js'
import { sound, SoundLoader } from '@pixi/sound'
import { app } from '../main'

sound.add('kick', kick)
sound.add('hihat', hihat)
sound.add('loop', loop)
sound.add('loop2', loop2)
sound.add('snare', snare)
sound.add('bass', bass)
sound.add('shot', shotWav)
sound.add('pickup', pickupWav)
sound.add('playerhit', playerhit)
sound.add('enemyhitwav', enemyhitwav)
sound.add('flamewav', flamewav)
sound.add('explosion', explosion)
sound.add('enemyhit', enemyhit)
sound.add('levelup', levelup)

export const resourcePaths = {
  shipPng,
  bgPng,
  miscPng,
  projPng,
  uiPng,
  charPng,
  particlePng,
  particlesPng,
  firePng
}

export const resources: PIXI.IAddOptions[] = [
  { name: 'ship', url: shipPng },
  { name: 'bg', url: bgPng },
  { name: 'misc', url: miscPng },
  { name: 'proj', url: projPng },
  { name: 'ui', url: uiPng },
  { name: 'char', url: charPng },
  { name: 'fire', url: fireWav },
  { name: 'fireWav', url: fireWav },
  { name: 'kick', url: kick },
  { name: 'hihat', url: hihat },
  { name: 'snare', url: snare },
  { name: 'loop', url: loop },
  { name: 'bass', url: bass },
  { name: 'particle', url: particlePng },
  { name: 'particles', url: particlesPng },
  { name: 'shot', url: shotWav },
  { name: 'playerhit', url: playerhit },
  { name: 'pickup', url: pickupWav },
  { name: 'firePng', url: firePng },
  { name: 'loop2', url: loop2 },
  { name: 'enemyhitwav', url: enemyhitwav },
  { name: 'flamewav', url: flamewav },
  { name: 'explosion', url: explosion },
  { name: 'enemyhit', url: enemyhit },
  { name: 'levelup', url: levelup }

]
