import { Context, Bee } from './types'
import * as uuid from 'uuid'
import { newNormalV3, V3 } from './lib/v3'

export const newBee = (ctx: Context): Bee => ({
  id: uuid.v4(),
  pos: new V3({ x: 0, y: 0, z: 0 }),
  vel: new V3(
    newNormalV3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
  )
})
