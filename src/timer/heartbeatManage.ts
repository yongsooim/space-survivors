import Worker from "./heartbeatWorker?worker";
import { bassSound, kickSound, loopSound, snareSound } from "../resource/resources";
import { hihatSound } from "../resource/resources";
import { player } from "../player/player";

let heartbeatWorker = new Worker();

kickSound.volume = 0.05;
hihatSound.volume = 0.05;
loopSound.volume = 0.02;
snareSound.volume = 0.05;
bassSound.volume = 0.1;

let beatCounter = 0;
export function heartbeatInit() {
  heartbeatWorker.onmessage = (evt) => {
    beatCounter++; // can have 1 ~ 16
    switch (beatCounter) {
      case 1:
      //loopSound.play()
      //bassSound.play()
    }
    switch (beatCounter) {
      case 1:
      case 9:
        kickSound.play();
        //loopSound.play()
        player.fire();
    }
    switch (beatCounter) {
      case 5:
      case 13:
        snareSound.play();
    }

    switch (beatCounter) {
      case 3:
      case 7:
      case 11:
      case 15:
        hihatSound.play();
    }

    if (beatCounter == 16) {
      beatCounter = 0;
    }
  };
}
