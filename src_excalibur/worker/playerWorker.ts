
declare interface Pos {
    x: number, y: number
}

class MainPlayerPos {
    x = 0
    y = 0
}
export let mainPlayerPos = new MainPlayerPos()

onmessage = (ev) => { 
    //console.log(ev.data)
    //mainPlayerPos.x = JSON.parse(ev.data).x
    //mainPlayerPos.y = JSON.parse(ev.data).y
}
