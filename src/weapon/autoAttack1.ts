import { Actor } from '../class/Actor'
import * as PIXI from 'pixi.js'

class AutoAttack1 extends PIXI.Sprite {
    update() {
        this.y -= 0.2
    }
}

class AutoAttack1Pool {
    public aaPool = [] as AutoAttack1[]
    constructor() {
        for (let i = 0; i < 500; i++) {
            this.aaPool[i] = new AutoAttack1()

        }
    }
}
