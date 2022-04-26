import { keyboard, Keys } from './keyboard'
import { touch } from './touch'
import { Direction } from '../type/type'
import { Vector } from '../class/Vector'

export declare enum SsKey {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
  UpLeft = 'UpLeft',
  UpRight = 'UpRight',
  DownLeft = 'DownLeft',
  DownRight = 'DownRight',
  Enter = 'Enter',
  Esc = 'Esc',
  Shift = 'Shift',
  C = 'C',
  Equal = 'Equal',
  Minus = 'Minus',
  None = 'None',
}

/** Direction to SsKey */
export function d2k (direction: Direction) {
  if (
    direction === Direction.Up ||
    direction === Direction.Down ||
    direction === Direction.Left ||
    direction === Direction.Right
  ) {
    return direction as string as SsKey
  } else {
    return SsKey.None
  }
}

/** SsKey to Direction */
export function k2d (key: SsKey) {
  if (
    key === SsKey.Up ||
    key === SsKey.Down ||
    key === SsKey.Left ||
    key === SsKey.Right
  ) {
    return key as string as Direction
  } else {
    return Direction.None
  }
}
export class Input {
  public vector = new Vector(0, 0)
  public isPressed = {
    Up: false,
    Down: false,
    Left: false,
    Right: false,
    UpLeft: false,
    UpRight: false,
    DownLeft: false,
    DownRight: false,
    Enter: false,
    Esc: false,
    C: false,
    Shift: false,
    Equal: false,
    Minus: false,
    None: false
  };

  init () {
    keyboard.init()
    touch.init()
  }

  update () {
    this.vector.x = touch.vector.x
    this.vector.y = touch.vector.y

    keyboard.update()

    if (
      keyboard.isHeld(Keys.Up) ||
      keyboard.isHeld(Keys.W) ||
      keyboard.isHeld(Keys.KeyW) ||
      touch.isPressed.Up
    ) {
      this.isPressed.Up = true
    } else {
      this.isPressed.Up = false
    }

    if (
      keyboard.isHeld(Keys.Down) ||
      keyboard.isHeld(Keys.S) ||
      keyboard.isHeld(Keys.KeyS) ||
      keyboard.isHeld(Keys.X) ||
      keyboard.isHeld(Keys.KeyX) ||
      touch.isPressed.Down
    ) {
      this.isPressed.Down = true
    } else {
      this.isPressed.Down = false
    }

    if (
      keyboard.isHeld(Keys.Left) ||
      keyboard.isHeld(Keys.A) ||
      keyboard.isHeld(Keys.KeyA) ||
      touch.isPressed.Left
    ) {
      this.isPressed.Left = true
    } else {
      this.isPressed.Left = false
    }

    if (
      keyboard.isHeld(Keys.Right) ||
      keyboard.isHeld(Keys.D) ||
      keyboard.isHeld(Keys.KeyD) ||
      touch.isPressed.Right
    ) {
      this.isPressed.Right = true
    } else {
      this.isPressed.Right = false
    }

    if (keyboard.isHeld(Keys.Q) || keyboard.isHeld(Keys.KeyQ)) {
      this.isPressed.UpLeft = true
    } else {
      this.isPressed.UpLeft = false
    }

    if (keyboard.isHeld(Keys.E) || keyboard.isHeld(Keys.KeyE)) {
      this.isPressed.UpRight = true
    } else {
      this.isPressed.UpRight = false
    }

    if (keyboard.isHeld(Keys.Z) || keyboard.isHeld(Keys.KeyZ)) {
      this.isPressed.DownLeft = true
    } else {
      this.isPressed.DownLeft = false
    }

    if (keyboard.isHeld(Keys.C) || keyboard.isHeld(Keys.KeyC)) {
      this.isPressed.DownRight = true
    } else {
      this.isPressed.DownRight = false
    }

    if (
      keyboard.isHeld(Keys.Esc) ||
      keyboard.isHeld(Keys.Escape) ||
      keyboard.isHeld(Keys.Numpad0)
    ) {
      this.isPressed.Esc = true
    } else {
      this.isPressed.Esc = false
    }

    if (keyboard.isHeld(Keys.Space)) {
      // To do : add keyboard.isHeld(Keys.Enter)
      this.isPressed.Enter = true
    } else {
      this.isPressed.Enter = false
    }

    if (keyboard.isHeld(Keys.ShiftLeft) || keyboard.isHeld(Keys.ShiftRight)) {
      this.isPressed.Shift = true
    } else {
      this.isPressed.Shift = false
    }

    if (keyboard.wasPressed(Keys.C) || keyboard.wasPressed(Keys.KeyC)) {
      this.isPressed.C = true
    } else {
      this.isPressed.C = false
    }
  }

  isDirectionPressed (direction: Direction) {
    switch (direction) {
    case Direction.Up:
      return this.isPressed.Up
    case Direction.Down:
      return this.isPressed.Down
    case Direction.Left:
      return this.isPressed.Left
    case Direction.Right:
      return this.isPressed.Right
    case Direction.UpLeft:
      return this.isPressed.UpLeft
    case Direction.UpRight:
      return this.isPressed.UpRight
    case Direction.DownLeft:
      return this.isPressed.DownLeft
    case Direction.DownRight:
      return this.isPressed.DownRight
    }
    return null
  }
}

export const input = new Input()
