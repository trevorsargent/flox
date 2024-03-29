import p5 from 'p5'
import { Agent } from '../flock/types/agent'
import { Context, Flock } from '../flock/types/flock'

// const WIDTH = 700
export const draw = (p: p5, flock: Flock): void => {
  p.clear()
  p.background(0, 0, 0)

  // p.directionalLight(255, 255, 255, 0, -1, 0)
  p.directionalLight(255, 255, 255, 0, +1, 0)
  p.ambientLight(100)

  p.normalMaterial()

  p.fill(255)

  // p.translate(0, 0, -0.25 * (flock.getParams().bounds.x + flock.getParams().bounds.z))
  p.rotateY(p.frameCount * 0.005)

  // Set the Scene

  p.push()

  p.translate(0, flock.getParams().boundY, 0)
  p.rotateX(-p.PI / 2)
  p.plane(flock.getParams().boundX * 2, flock.getParams().boundZ * 2)

  p.pop()
  p.push()

  p.translate(0, -1 * flock.getParams().boundY, 0)
  p.rotateX(p.PI / 2)
  p.plane(flock.getParams().boundX * 2, flock.getParams().boundZ * 2)

  p.pop()

  p.noFill()
  p.stroke(255)

  p.box(
    flock.getParams().boundX * 2,
    flock.getParams().boundY * 2,
    flock.getParams().boundZ * 2
  )
  p.noStroke()
  p.fill(255, 255, 255)
  flock.getAgents().forEach((agent) => drawAgent(p, agent))
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
