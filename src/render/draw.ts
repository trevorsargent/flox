import p5, { Vector } from 'p5'
import { pipe } from 'ramda'
import { applyToComponents, heading2d, normalize, scale } from '../lib/v3'
import { Context, Canvas, Bee } from '../types'

// const WIDTH = 700
export const draw = (p: p5, ctx: Context): void => {
  p.clear()
  p.background(0, 0, 0)

  // p.directionalLight(255, 255, 255, 0, -1, 0)
  p.directionalLight(255, 255, 255, 0, +1, 0)
  p.ambientLight(100)

  p.normalMaterial()

  p.fill(255)

  p.translate(0, 0, -400)
  p.rotateY(p.frameCount * 0.005)

  // Set the Scene

  p.push()

  p.translate(0, ctx.bounds.y, 0)
  p.rotateX(-p.PI / 2)
  p.plane(ctx.bounds.x * 2, ctx.bounds.z * 2)

  p.pop()
  p.push()

  p.translate(0, -1 * ctx.bounds.y, 0)
  p.rotateX(p.PI / 2)
  p.plane(ctx.bounds.x * 2, ctx.bounds.z * 2)

  p.pop()

  p.noFill()
  p.stroke(255)

  p.box(ctx.bounds.x * 2, ctx.bounds.y * 2, ctx.bounds.z * 2)
  p.noStroke()
  p.fill(255, 255, 255)
  ctx.bees.forEach((bee) => drawBee(p, ctx, bee))
}

const drawBee = (p: p5, ctx: Context, bee: Bee): void => {
  const beeSize = 6
  const beeShade = 5

  p.fill(255)

  // const color = pipe(
  //   normalize,
  //   applyToComponents((c) => 255 * c + 255 / 2)
  // )(bee.vel)

  // p.fill(color.x, color.y, color.z)

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
