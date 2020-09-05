import { Context, Bee } from './types'
import * as uuid from 'uuid'
import p5 from 'p5'

export const newBee = (
  p: p5,
  ctx: Context,
  debugTarget: boolean = false
): Bee => ({
  id: uuid.v4(),
  pos: ctx.canvas.center,
  vel: p.createVector(Math.random() - 0.5, Math.random() - 0.5).normalize(),
  isDebugBee: debugTarget
})
