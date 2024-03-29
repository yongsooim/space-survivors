const consts = {
  numberOfEnemy1: 1024,
  enemy1speed: 0.0018,

  numberOfEnemy2: 1024,
  enemy2speed: 0.003,

  numberOfEnemy3: 256,
  enemy3speed: 0.001,

  spawnSize: 100,
  resource1SpawnSize: 300,
  resource2SpawnSize: 100,
  mapSize: 600 / 2,

  numberOfWeapon1: 128,

  numberOfResource1: 4096,
  numberOfResource2: 1024,

  numberOfAutoAttack1: 128,
  autoAttack1Speed: 0.06,

  numberOfFlame1: 10,
  flame1Speed: 0.02,

  numberOfMissile1: 128,
  missile1Speed: 0.02,

  playerSpeed: 0.06,

  worker1Interval: 1000 / 60,
  worker2Interval: 1000 / 60,
  worker3Interval: 1000 / 45,

  magnetRange: 6,
  getRange: 1,

  numberOfDamageText: 256,
  numberOfExplosion: 256,

  nowhere: 1000, // place where dead enemies go
  tooFar: 100 // when enemy is farther than this, it will go to nowhere
}

export default consts
