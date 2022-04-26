import shipPng from '../asset/ship.png'
import bgPng from '../asset/bg.png'
import miscPng from '../asset/misc.png'
import projPng from '../asset/proj.png'
import uiPng from '../asset/ui.png'
import charPng from '../asset/char.png'
import particlePng from "../asset/particle.png";

import fireWav from '../asset/Laser_Shoot9.wav'
import kick from '../asset/kick.wav'
import hihat from '../asset/hihat_close.wav'
import snare from '../asset/snare.wav'
import loop from '../asset/loop.wav'
import bass from '../asset/bass.wav'
import * as PIXI from 'pixi.js'
import { sound } from '@pixi/sound'

sound.add('kick', kick)
sound.add('hihat', hihat)
sound.add('loop', loop)
sound.add('snare', snare)
sound.add('bass', bass)


export const resourcePaths = {
  shipPng,
  bgPng,
  miscPng,
  projPng,
  uiPng,
  charPng,
  particlePng
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
]
