import p5 from 'p5'
import { Agent } from '../src/flock/types/agent'
import { Context } from '../src/flock/types/flock'

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

  p.translate(0, ctx.params.boundY, 0)
  p.rotateX(-p.PI / 2)
  p.plane(ctx.params.boundX * 2, ctx.params.boundZ * 2)

  p.pop()
  p.push()

  p.translate(0, -1 * ctx.params.boundY, 0)
  p.rotateX(p.PI / 2)
  p.plane(ctx.params.boundX * 2, ctx.params.boundZ * 2)

  p.pop()

  p.noFill()
  p.stroke(255)

  p.box(ctx.params.boundX * 2, ctx.params.boundY * 2, ctx.params.boundZ * 2)
  p.noStroke()
  p.fill(255, 255, 255)
  ctx.agents.forEach((agent) => drawAgent(p, agent))
}

const drawAgent = (p: p5, agent: Agent): void => {
  const size = 3
  const shade = 5

  p.fill(255)

  p.push()
  p.translate(agent.pos.x, agent.pos.y, agent.pos.z)

  p.sphere(size)
  p.pop()
}
