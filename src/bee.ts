import { Context, Bee } from './types'
import * as uuid from 'uuid'
import { newNormalV3 } from './lib/v3'

export const newBee = (
  ctx: Context,
): Bee => ({
  id: uuid.v4(),
  pos: ctx.canvas.center,
  vel: newNormalV3(Math.random() - 0.5, Math.random() - 0.5, 0),
})
