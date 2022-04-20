
let commands 

declare interface ICommand {
    stop : string,
    strat : string,
    reset : string,

    kill : number[],  // list of to killed enemies ID in enemyPool (0 ~ numberOfEnemy)
    gen : number[] // list of to generated enemies ID
}
