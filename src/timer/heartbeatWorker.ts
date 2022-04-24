import * as hb from 'heartbeats'

let heart = hb.createHeart(125)
// 120 bpm, 16 beat
// 1 beat = 5000ms / 16 = 125ms

setInterval(()=>{
  self.postMessage(0)
}, 125)

//heart.createEvent(1, () => {
//  self.postMessage(0)
//})
