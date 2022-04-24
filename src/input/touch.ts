import { viewport } from "../main";
import nipplejs from "nipplejs";
import { Direction } from "../type/type";
import { Vector } from '../class/Vector'

let manager = nipplejs.create({
  color: "#484848",
  fadeTime:0
});
class Touch {

  vector = Vector.Zero

  isPressed = {
    Up: false,
    Down: false,
    Right: false,
    Left: false,
  };
  init() {
    
  viewport.on("pinch-start", () => {
    manager.destroy()
    this.vector.x = 0
    this.vector.y = 0
    touch.isPressed.Up = false;
    touch.isPressed.Down = false;
    touch.isPressed.Left = false;
    touch.isPressed.Right = false;
  });
  viewport.on("pinch-end", () => {
    manager = nipplejs.create({
      color: "#484848",
      fadeTime:0
    });
    this.vector.x = 0
    this.vector.y = 0
    this.initNipple()
  });
  
  this.initNipple()
}

initNipple = () => {
  manager.on("move", (evt, nipple) => {
    this.vector.x = nipple.vector.x
    this.vector.y = nipple.vector.y
    
    if (nipple.distance > 10) {
      if (
        nipple.angle.radian <= Math.PI / 8 ||
        nipple.angle.radian > (Math.PI * 15) / 8
      ) {
        touch.isPressed.Up = false;
        touch.isPressed.Down = false;
        touch.isPressed.Left = false;
        touch.isPressed.Right = true;
      } else if (
        (Math.PI * 1) / 8 <= nipple.angle.radian &&
        nipple.angle.radian < (Math.PI * 3) / 8
      ) {
        touch.isPressed.Up = true;
        touch.isPressed.Down = false;
        touch.isPressed.Left = false;
        touch.isPressed.Right = true;
      } else if (
        (Math.PI * 3) / 8 <= nipple.angle.radian &&
        nipple.angle.radian < (Math.PI * 5) / 8
      ) {
        touch.isPressed.Up = true;
        touch.isPressed.Down = false;
        touch.isPressed.Left = false;
        touch.isPressed.Right = false;
      } else if (
        (Math.PI * 5) / 8 <= nipple.angle.radian &&
        nipple.angle.radian < (Math.PI * 7) / 8
      ) {
        touch.isPressed.Up = true;
        touch.isPressed.Down = false;
        touch.isPressed.Left = true;
        touch.isPressed.Right = false;
      } else if (
        (Math.PI * 7) / 8 <= nipple.angle.radian &&
        nipple.angle.radian < (Math.PI * 9) / 8
      ) {
        touch.isPressed.Up = false;
        touch.isPressed.Down = false;
        touch.isPressed.Left = true;
        touch.isPressed.Right = false;
      } else if (
        (Math.PI * 9) / 8 <= nipple.angle.radian &&
        nipple.angle.radian < (Math.PI * 11) / 8
      ) {
        touch.isPressed.Up = false;
        touch.isPressed.Down = true;
        touch.isPressed.Left = true;
        touch.isPressed.Right = false;
      } else if (
        (Math.PI * 11) / 8 <= nipple.angle.radian &&
        nipple.angle.radian < (Math.PI * 13) / 8
      ) {
        touch.isPressed.Up = false;
        touch.isPressed.Down = true;
        touch.isPressed.Left = false;
        touch.isPressed.Right = false;
      } else if (
        (Math.PI * 13) / 8 <= nipple.angle.radian &&
        nipple.angle.radian < (Math.PI * 15) / 8
      ) {
        touch.isPressed.Up = false;
        touch.isPressed.Down = true;
        touch.isPressed.Left = false;
        touch.isPressed.Right = true;
      }
    }
  });

  manager.on("end", (evt, nipple) => {
    this.vector.x = 0
    this.vector.y = 0

    touch.isPressed.Up = false;
    touch.isPressed.Down = false;
    touch.isPressed.Left = false;
    touch.isPressed.Right = false;
  });
  }
}

export const touch = new Touch();
