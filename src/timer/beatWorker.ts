// 120 bpm, 16 beat
// 1 beat = 5000ms / 16 = 125ms

let running = false
const interval = 125
const gap = 8 // gap before nextExecute, and endless loop until reach nextExecute
let error = 0

onmessage = (ev) => {
  if (ev.data === 'start') {
    running = true
    now = Date.now()
    nextExecute = now + interval
    counting()
  } else if (ev.data === 'stop') {
    running = false
  }
}

let now = Date.now()
let nextExecute = 0

nextExecute = now + interval
const counting = () => {
  while (now < nextExecute) { // wating for target time
    now = Date.now()
  }
  self.postMessage(0)
  error = now - nextExecute
  nextExecute = nextExecute + interval
  setTimeout(() => {
    if (running) {
      counting()
    }
  }, interval - gap - error)
}

export { }
