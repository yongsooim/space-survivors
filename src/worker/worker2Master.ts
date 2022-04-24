import Worker from "./worker2?worker";
import sabWorker1 from "./sabManage";

const myWorker = new Worker();
myWorker.postMessage([
  sabWorker1.autoAttack1Positions,
  sabWorker1.enemy1Positions,
  sabWorker1.enemy1Hps
]);

export {};
