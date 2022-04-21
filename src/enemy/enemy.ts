import { Actor } from '../class/Actor'

interface EnemyOption {
    damage? : number
    speed? : number
}

class Enemy extends Actor {
    public damage
    constructor(option?:EnemyOption){
        super()
        this.damage = option?.damage
    }
}