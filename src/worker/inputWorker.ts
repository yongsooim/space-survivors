
declare interface IsKeyPrssed {
  Up: boolean,
  Down: boolean,
  Left: boolean,
  Right: boolean,
  UpLeft: boolean,
  UpRight: boolean,
  DownLeft: boolean,
  DownRight: boolean,
  Enter: boolean,
  Esc: boolean,
  C: boolean,
  Shift: boolean,
  None: boolean
}

export let isPressed : IsKeyPrssed = {
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

onmessage = (ev) => { // from input.ts at onPreUpdate
  isPressed = JSON.parse(ev.data) as IsKeyPrssed
}
