
import Worker from './worker1?worker'
import sabWorker1 from './sabManage'
import * as PIXI from 'pixi.js'
import { viewport } from '../viewport/viewport'
import { numberOfEnemy1 } from '../type/const'
import { enemy1 } from '../resource/spriteManage'

const worker1 = new Worker()

let tempIterator = 0
let indexDouble = 0

const enemy1container = new PIXI.ParticleContainer(
    numberOfEnemy1,
    {
        vertices: false,
        rotation: false,
        uvs: false,
        tint: false,
        alpha: true,
        scale: false,
        position: true
    },
    numberOfEnemy1,
    false
)

export async function worker1init(){

    sabWorker1.enemy1HpsArr.forEach((v, i, a) => {
        a[i] = 1
    })
    const enemy1ships = [] as PIXI.Sprite[]

    viewport.addChild(enemy1container)
    
    tempIterator = numberOfEnemy1
    
    while (tempIterator--) {
        enemy1ships[tempIterator] = new PIXI.Sprite(enemy1)
    
        enemy1ships[tempIterator].scale.x = 0.2
        enemy1ships[tempIterator].scale.y = 0.2
    
        enemy1ships[tempIterator].anchor.x = 0.5
        enemy1ships[tempIterator].anchor.y = 0.5
    
        enemy1ships[tempIterator].anchor.set(0.5)
        enemy1ships[tempIterator].x = 9999
        enemy1ships[tempIterator].y = 9999
        enemy1ships[tempIterator].cacheAsBitmapResolution = 1
        enemy1ships[tempIterator].cacheAsBitmap = true
        enemy1container.addChild(enemy1ships[tempIterator])
    }
}

export function enemy1update() {
    tempIterator = numberOfEnemy1
    while (tempIterator--) {
        if (sabWorker1.enemy1HpsArr[tempIterator] <= 0) {
            sabWorker1.enemy1HpsArr[tempIterator] = 0
            enemy1container.children[tempIterator].alpha = 0
            continue
        }
        indexDouble = tempIterator * 2
        enemy1container.children[tempIterator].x = sabWorker1.enemy1PositionsArr[indexDouble]
        enemy1container.children[tempIterator].y = sabWorker1.enemy1PositionsArr[indexDouble + 1]
    }
}

setTimeout(() => {
    worker1.postMessage([sabWorker1.playerPosition, sabWorker1.enemy1Positions, sabWorker1.enemy1Hps])
}, 1000)

window.onbeforeunload = () => {
    location.reload()
    document.location.reload()
    worker1.postMessage({ cmd: 'close' })
    worker1.terminate()
    PIXI.utils.clearTextureCache()
}

//window.onblur = (e) => {
//  worker1.postMessage({ cmd: 'stop' })
//}

window.onclose = () => {
    worker1.postMessage({ cmd: 'close' })
    worker1.terminate()
    PIXI.utils.clearTextureCache()
}

window.document.addEventListener('beforeunload', () => {
    worker1.terminate()
    worker1.postMessage('')
    PIXI.utils.clearTextureCache()
})

export { }
