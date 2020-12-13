import p5, { Vector } from 'p5'
import { heading2d, scale } from '../lib/v3'
import { Context, Canvas, Bee } from '../types'

// const WIDTH = 700
export const draw = (p: p5, ctx: Context):void => {
  p.clear()
  ctx.bees.forEach((bee) => drawBee(p, ctx, bee))
}

const drawBee = (p: p5, ctx: Context, bee: Bee): void => {
  const beeSize = 3
  const beeShade = 5

  

  p.push()
  p.translate(bee.pos.x, bee.pos.y, bee.pos.z)
  p.sphere(beeSize)
  p.pop()

  if (ctx.debugOptions.showVelocityVectors) {
    drawVelocityVector(p, bee)
  }

  if (ctx.debugOptions.showViewArea) {
    drawViewArea(p, ctx, bee)
  }
}

const drawVelocityVector = (p: p5, bee: Bee) => {
  const { pos, vel } = bee
  const scaled = scale(10)(vel)
  p.stroke(200)
  p.line(pos.x, pos.y, pos.x + scaled.x, pos.y + scaled.y)
}

const drawViewArea = (p: p5, ctx: Context, bee: Bee) => {
  p.noFill()
  p.stroke(200)
  p.arc(
    bee.pos.x,
    bee.pos.y,
    (ctx.params.viewDistance.ref.value() as number) * 2,
    (ctx.params.viewDistance.ref.value() as number) * 2,
    heading2d(bee.vel) - (ctx.params.viewAngle.ref.value() as number) / 2,
    heading2d(bee.vel) + (ctx.params.viewAngle.ref.value() as number) / 2,
    p.PIE
  )
}
