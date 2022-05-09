import * as PIXI from 'pixi.js'
import consts from '../type/const'
import { viewportContainer } from '../viewport/viewport'
import { app } from '../main'
import { sound } from '@pixi/sound'

class DamageTextPool {
  cursor = 0
  pool: PIXI.Text[] = []
  hitpool: PIXI.Text[] = []

  constructor () {
    for (let i = 0; i < consts.numberOfDamageText; i++) {
      const temp = new PIXI.Text('', { fontFamily: 'Consolas', fontSize: 15, fill: 0xffffff, align: 'center', dropShadow: true, strokeThickness: 1 })
      temp.scale.set(0.07)
      temp.anchor.set(0.5)
      this.pool.push(temp)
    }

    for (let i = 0; i < consts.numberOfDamageText; i++) {
      const temp = new PIXI.Text('', { fontFamily: 'Consolas', fontSize: 15, fill: 0xff0000, align: 'center', dropShadow: true, strokeThickness: 1 })
      temp.scale.set(0.07)
      temp.anchor.set(0.5)
      this.hitpool.push(temp)
    }
  }

  show (x: number, y: number, damage: number) {
    this.cursor++
    if (this.cursor >= consts.numberOfDamageText) this.cursor = 0

    //sound.volume('enemyhitwav', 0.5)

    sound.play('enemyhitwav')
    const currentCursor = this.cursor
    this.pool[currentCursor].alpha = 1
    this.pool[currentCursor].text = damage.toString()
    this.pool[currentCursor].position.set(x, y)
    viewportContainer.addChild(this.pool[currentCursor])

    const damageTextAnimation = (delta: number) => {
      this.pool[currentCursor].alpha -= 0.01 * delta
      const speed = this.pool[currentCursor].alpha * this.pool[currentCursor].alpha
      if (this.pool[currentCursor].alpha >= 0.9) {
        this.pool[currentCursor].position.y -= 0.03 * speed
      } else {
        this.pool[currentCursor].position.y += 0.02 * speed
      }
    }

    app.ticker.add(damageTextAnimation)

    setTimeout(() => {
      viewportContainer.removeChild(this.pool[currentCursor])
      app.ticker.remove(damageTextAnimation)
    }, 2000)
  }

  playerhit (x: number, y: number, damage: number) {
    this.cursor++
    if (this.cursor >= consts.numberOfDamageText) this.cursor = 0

    const currentCursor = this.cursor
    this.hitpool[currentCursor].alpha = 1
    this.hitpool[currentCursor].text = damage.toString()
    this.hitpool[currentCursor].position.set(x, y)
    viewportContainer.addChild(this.hitpool[currentCursor])

    const hitTextAnimation = (delta: number) => {
      this.hitpool[currentCursor].alpha -= 0.01 * delta
      const speed = this.hitpool[currentCursor].alpha * this.hitpool[currentCursor].alpha
      if (this.hitpool[currentCursor].alpha >= 0.9) {
        this.hitpool[currentCursor].position.y -= 0.03 * speed
      } else {
        this.hitpool[currentCursor].position.y += 0.02 * speed
      }
    }

    app.ticker.add(hitTextAnimation)

    setTimeout(() => {
      viewportContainer.removeChild(this.pool[currentCursor])
      app.ticker.remove(hitTextAnimation)
    }, 2000)
  }
}

// Set the name of the hidden property and the change event for visibility
let hidden: string, visibilityChange
if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden'
  visibilityChange = 'visibilitychange'
  // @ts-ignore
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden'
  visibilityChange = 'msvisibilitychange'
  // @ts-ignore
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden'
  visibilityChange = 'webkitvisibilitychange'
}
function handleVisibilityChange () {
  // @ts-ignore
  if (document[hidden]) {
    // console.log('hidden')

    damageTextPool.hitpool.forEach((v, i, a) => {
      a[i].alpha = 0
    })
    damageTextPool.pool.forEach((v, i, a) => {
      a[i].alpha = 0
    })

    console.log('hidden')
  } else {
    // console.log('show')
    // damageTextPool.hitpool.forEach((v, i, a) => {
    //  a[i].alpha = 1
    // })
    // damageTextPool.pool.forEach((v, i, a) => {
    //  a[i].alpha = 1
    // })
  }
}

document.addEventListener(visibilityChange as string, handleVisibilityChange, false)

export const damageTextPool = new DamageTextPool()
