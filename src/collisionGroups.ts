import { CollisionGroup, CollisionGroupManager } from "excalibur"
// Create a group for each distinct category of "collidable" in your game
export const weaponGroup = CollisionGroupManager.create('weaponGroup')
export const playerGroup = CollisionGroupManager.create('playerGroup')
export const enemyGroup = CollisionGroupManager.create('enemyGroup')


// Define your rules
export const playersCanCollideWith = CollisionGroup.collidesWith([
    enemyGroup, 
])

export const enemiesCanCollideWith = CollisionGroup.collidesWith([
    weaponGroup
])

export const weaponCanCollideWith = CollisionGroup.collidesWith([
    enemyGroup,
])
