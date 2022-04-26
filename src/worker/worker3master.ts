import * as PIXI from 'pixi.js'
import Worker from './worker3?worker'
import { numberOfResource1 } from '../type/const'
import { viewport } from '../viewport/viewport'

const worker3 = new Worker()

const resource1container = new PIXI.ParticleContainer(numberOfResource1,
    {
        alpha: true,
        position: true
    },
    numberOfResource1,
    false
)

let tempIterator = 0

export async function worker1init(){
    const resource1sprites = [] as PIXI.Sprite[]
    viewport.addChild(resource1container)
    tempIterator = numberOfResource1
    while (tempIterator--) {
        resource1sprites[tempIterator] = new PIXI.Sprite()
    
        resource1sprites[tempIterator].scale.x = 0.2
        resource1sprites[tempIterator].scale.y = 0.2
    
        resource1sprites[tempIterator].anchor.x = 0.5
        resource1sprites[tempIterator].anchor.y = 0.5
    
        resource1sprites[tempIterator].anchor.set(0.5)
        resource1sprites[tempIterator].x = 9999
        resource1sprites[tempIterator].y = 9999
        resource1sprites[tempIterator].cacheAsBitmapResolution = 1
        resource1sprites[tempIterator].cacheAsBitmap = true
        resource1container.addChild(resource1sprites[tempIterator])
    }
}