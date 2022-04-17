import { Engine, Entity, Input } from 'excalibur'
import { game } from '../main'

export enum Direction {
  Up = 'Up',
  Left = 'Left',
  Right = 'Right',
  Down = 'Down',
  UpLeft = 'UpLeft',
  UpRight = 'UpRight',
  DownLeft = 'DownLeft',
  DownRight = 'DownRight',
  None = 'None',
}

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

/** to keyboard input */
export function d2key (direction: Direction) {
  if (direction === Direction.Up) {
    return Input.Keys.Up
  } else if (direction === Direction.Down) {
    return Input.Keys.Down
  } else if (direction === Direction.Left) {
    return Input.Keys.Left
  } else if (direction === Direction.Right) {
    return Input.Keys.Right
  } else {
    console.log('error')
    throw Error('Not supported direction ')
  }
}

class InputManager extends Entity {
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
    None: false
  };

  /** Updating fsb keys */
  update (game: Engine, delta: number) {
    if (
      game.input.keyboard.isHeld(Input.Keys.Up) ||
      game.input.keyboard.isHeld(Input.Keys.W) ||
      game.input.keyboard.isHeld(Input.Keys.KeyW)
    ) {
      this.isPressed.Up = true
    } else {
      this.isPressed.Up = false
    }

    if (
      game.input.keyboard.isHeld(Input.Keys.Down) ||
      game.input.keyboard.isHeld(Input.Keys.S) ||
      game.input.keyboard.isHeld(Input.Keys.KeyS) ||
      game.input.keyboard.isHeld(Input.Keys.X) ||
      game.input.keyboard.isHeld(Input.Keys.KeyX)
    ) {
      this.isPressed.Down = true
    } else {
      this.isPressed.Down = false
    }

    if (
      game.input.keyboard.isHeld(Input.Keys.Left) ||
      game.input.keyboard.isHeld(Input.Keys.A) ||
      game.input.keyboard.isHeld(Input.Keys.KeyA)
    ) {
      this.isPressed.Left = true
    } else {
      this.isPressed.Left = false
    }

    if (
      game.input.keyboard.isHeld(Input.Keys.Right) ||
      game.input.keyboard.isHeld(Input.Keys.D) ||
      game.input.keyboard.isHeld(Input.Keys.KeyD)
    ) {
      this.isPressed.Right = true
    } else {
      this.isPressed.Right = false
    }

    if (
      game.input.keyboard.isHeld(Input.Keys.Q) ||
      game.input.keyboard.isHeld(Input.Keys.KeyQ)
    ) {
      this.isPressed.UpLeft = true
    } else {
      this.isPressed.UpLeft = false
    }

    if (
      game.input.keyboard.isHeld(Input.Keys.E) ||
      game.input.keyboard.isHeld(Input.Keys.KeyE)
    ) {
      this.isPressed.UpRight = true
    } else {
      this.isPressed.UpRight = false
    }

    if (
      game.input.keyboard.isHeld(Input.Keys.Z) ||
      game.input.keyboard.isHeld(Input.Keys.KeyZ)
    ) {
      this.isPressed.DownLeft = true
    } else {
      this.isPressed.DownLeft = false
    }

    if (
      game.input.keyboard.isHeld(Input.Keys.C) ||
      game.input.keyboard.isHeld(Input.Keys.KeyC)
    ) {
      this.isPressed.DownRight = true
    } else {
      this.isPressed.DownRight = false
    }

    if (
      game.input.keyboard.isHeld(Input.Keys.Esc) ||
      game.input.keyboard.isHeld(Input.Keys.Escape) ||
      game.input.keyboard.isHeld(Input.Keys.Numpad0)
    ) {
      this.isPressed.Esc = true
    } else {
      this.isPressed.Esc = false
    }

    if (game.input.keyboard.isHeld(Input.Keys.Space)) {
      // To do : add game.input.keyboard.isHeld(Input.Keys.Enter)
      console.log('enter pressed')
      this.isPressed.Enter = true
    } else {
      this.isPressed.Enter = false
    }

    if (
      game.input.keyboard.isHeld(Input.Keys.ShiftLeft) ||
      game.input.keyboard.isHeld(Input.Keys.ShiftRight)
    ) {
      this.isPressed.Shift = true
    } else {
      this.isPressed.Shift = false
    }

    if (
      game.input.keyboard.wasPressed(Input.Keys.C) ||
      game.input.keyboard.wasPressed(Input.Keys.KeyC)
    ) {
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

  /** It decides priority when multiple direction key is pressed at the same time */
  isAnyDirectionPressed () {
    if (this.isPressed.Up) {
      return Direction.Up
    } else if (this.isPressed.Down) {
      return Direction.Down
    } else if (this.isPressed.Left) {
      return Direction.Left
    } else if (this.isPressed.Right) {
      return Direction.Right
    } else {
      return Direction.None
    }
  }
}

export const input = new InputManager()
