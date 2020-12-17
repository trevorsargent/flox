import p5 from 'p5'
import { Bee } from '../flock/types/bee'
import { Context } from '../flock/types/flock'

// const WIDTH = 700
export const draw = (p: p5, ctx: Context): void => {
  p.clear()
  p.background(0, 0, 0)

  // p.directionalLight(255, 255, 255, 0, -1, 0)
  p.directionalLight(255, 255, 255, 0, +1, 0)
  p.ambientLight(100)

  p.normalMaterial()

  p.fill(255)

  // p.translate(0, 0, -0.25 * (ctx.params.bounds.x + ctx.params.bounds.z))
  p.rotateY(p.frameCount * 0.005)

  // Set the Scene

  p.push()

  p.translate(0, ctx.params.bounds.y, 0)
  p.rotateX(-p.PI / 2)
  p.plane(ctx.params.bounds.x * 2, ctx.params.bounds.z * 2)

  p.pop()
  p.push()

  p.translate(0, -1 * ctx.params.bounds.y, 0)
  p.rotateX(p.PI / 2)
  p.plane(ctx.params.bounds.x * 2, ctx.params.bounds.z * 2)

  p.pop()

  p.noFill()
  p.stroke(255)

  p.box(
    ctx.params.bounds.x * 2,
    ctx.params.bounds.y * 2,
    ctx.params.bounds.z * 2
  )
  p.noStroke()
  p.fill(255, 255, 255)
  ctx.bees.forEach((bee) => drawBee(p, ctx, bee))
}

const drawBee = (p: p5, ctx: Context, bee: Bee): void => {
  const beeSize = 3
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
}
