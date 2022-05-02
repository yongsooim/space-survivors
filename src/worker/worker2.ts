// this worker calculates collision between enemy and player

import consts from "../type/const";

let playerPosition: Float64Array;
let enemy1Positions: Float64Array;
let enemy1Directions: Float64Array;
let enemy1Hps: Int32Array;
let life: Int32Array;
let lock: Int32Array;

let lastExecuted = Date.now();
let delta = 0;
let now = 0;
let stepTime = 0;
let running = false;

let port: MessagePort;

let loopInterval: number;

onmessage = (ev) => {
  if (ev.data.cmd === "stop") {
    running = false;
  } else if (ev.data.cmd === "start") {
    running = true;
  } else if (ev.data.cmd === "close") {
    running = false;
    clearInterval(loopInterval);
    self.close();
  } else if (ev.data.cmd === "init") {
    console.log(ev.data);
    playerPosition = new Float64Array(ev.data.sab.playerPosition);
    enemy1Positions = new Float64Array(ev.data.sab.enemy1Positions);
    enemy1Directions = new Float64Array(ev.data.sab.enemy1Directions);
    enemy1Hps = new Int32Array(ev.data.sab.enemy1Hps);
    life = new Int32Array(ev.data.sab.life);
    lock = new Int32Array(ev.data.sab.lock);
    port = ev.ports[0];

    port.onmessage = calc;
  }
};

let tempIterator = 0;
let indexDouble = 0;
let playerX = 0, playerY = 0;
let enemyX = 0, enemyY = 0;
let diffX = 0,  diffY = 0;
let directionX = 0, directionY = 0;
let distance = 0;

let divide = 30;
let count = 0;
let calc = () => {
  if (running === false) return;

  count++;
  if (count === divide) {
    count = 0;
  }
  
  tempIterator = consts.numberOfEnemy1;
  playerX = playerPosition[0];
  playerY = playerPosition[1];
  for (tempIterator = count; tempIterator < consts.numberOfEnemy1; tempIterator += divide) {
    if (enemy1Hps[tempIterator] === 0) continue; //skip dead enemy

    indexDouble = tempIterator * 2;
    enemyX = enemy1Positions[indexDouble];
    enemyY = enemy1Positions[indexDouble + 1];
    diffX = playerX - enemyX;
    diffY = playerY - enemyY;
    distance = Math.sqrt(diffX * diffX + diffY * diffY);

    if (distance < 2) {
      self.postMessage({ cmd: "hitText", x: (playerX + enemyX) / 2, y: (playerY + enemyY) / 2 });
    }

    directionX = (consts.enemy1speed * diffX) / distance;
    directionY = (consts.enemy1speed * diffY) / distance;

    enemy1Directions[indexDouble] = directionX;
    enemy1Directions[indexDouble + 1] = (consts.enemy1speed * diffY) / distance;
  }
};

postMessage({ cmd: "ready" });
