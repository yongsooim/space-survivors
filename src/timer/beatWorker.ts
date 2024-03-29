// 120 bpm, 16 beat
// 1 beat = 5000ms / 16 = 125ms
const interval = 125
const gap = 3 // how much earlier wakeup before nextExecute, and check loop until reach nextExecute
let running = false
let error = 0
let now = Date.now()
let nextExecute = 0

const counter = 0

onmessage = (ev) => {
  if (ev.data.cmd === 'stop') {
    running = false
  } else if (ev.data === 'start') {
    running = true
    now = Date.now()
    nextExecute = now + interval
    timerId = setTimeout(counting, interval - gap - error)
  } else if (ev.data === 'stop') {
    clearTimeout(timerId)
    running = false
  } else if (ev.data === 'close') {
    clearTimeout(timerId)
    running = false
    self.close()
  }
}

let timerId: number
nextExecute = now + interval
const counting = () => {
  // wakeup in advance
  now = Date.now()
  while (now < nextExecute) { // wating for target time
    now = Date.now()
  }
  self.postMessage(0)
  error = now - nextExecute
  nextExecute = nextExecute + interval
  timerId = setTimeout(() => {
    if (running) {
      counting()
    }
  }, interval - gap - error)
}

// some more calcuation after post beat done?
postMessage('ready')
export { }
