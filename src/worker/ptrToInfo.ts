export const ptrToInfo: Info[] = []

declare interface Info {
  category : 'player' | 'enemy' | 'weapon',
  type? : 'autoAttack1' | 'flame1' | 'enemy1' | 'enemy2',
  attribute? : 'bullet' | 'splash',
  damage? : number
}

/*
ptrToInfo[getPointer(this.pool[i])] = {
    category: 'enemy',
    type: 'enemy1'
  }

        ptrToInfo[getPointer(this.pool[i])] = {
          category: 'attack',
          type: 'attack1',
          attribute: 'bullet',
          damage : 5
        }

  */
