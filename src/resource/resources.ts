import shipPng from '../asset/ship.png'
import bgPng from '../asset/bg.png'
import miscPng from '../asset/misc.png'
import projPng from '../asset/proj.png'
import uiPng from '../asset/ui.png'
import charPng from '../asset/char.png'
import fireWav from '../asset/Laser_Shoot9.wav'
import kick from '../asset/kick.wav'
import hihat from '../asset/hihat_close.wav'
import snare from '../asset/snare.wav'
import loop from '../asset/loop.wav'
import bass from '../asset/bass.wav'
import * as PIXI from 'pixi.js'
import { Sound, sound } from '@pixi/sound'

sound.add('kick', kick)
sound.add('hihat_close', hihat)
sound.add('loop', loop)
sound.add('snare', snare)
sound.add('bass', bass)

export const kickSound = Sound.from(kick)
export const hihatSound = Sound.from(hihat)
export const loopSound = Sound.from(loop)
export const snareSound = Sound.from(snare)
export const bassSound = Sound.from(bass)

export const resourcePaths = {
  shipPng,
  bgPng,
  miscPng,
  projPng,
  uiPng,
  charPng,
  fireWav
}

export const resources: PIXI.IAddOptions[] = [
  { name: 'ship', url: shipPng, loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE },
  { name: 'bg', url: bgPng },
  { name: 'misc', url: miscPng },
  { name: 'proj', url: projPng },
  { name: 'ui', url: uiPng },
  { name: 'char', url: charPng },
  { name: 'fire', url: fireWav }
]
