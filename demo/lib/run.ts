import p5 from 'p5'
import { FlockParams } from '../../bindings/FlockParams'
import { JsAgent } from '../../bindings/JsAgent'
import { Agent } from './agent'
import { Flock } from './flock'

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

  p.translate(0, flock.getParams().bound_y, 0)
  p.rotateX(-p.PI / 2)
  p.plane(flock.getParams().bound_x * 2, flock.getParams().bound_z * 2)

  p.pop()
  p.push()

  p.translate(0, -1 * flock.getParams().bound_y, 0)
  p.rotateX(p.PI / 2)
  p.plane(flock.getParams().bound_x * 2, flock.getParams().bound_z * 2)

  p.pop()

  p.noFill()
  p.stroke(255)

  p.box(
    flock.getParams().bound_x * 2,
    flock.getParams().bound_y * 2,
    flock.getParams().bound_z * 2
  )
  p.noStroke()
  p.fill(255, 255, 255)
  flock
    .getAgents()
    .forEach((agent, index) =>
      drawAgent(p, agent, flock.getParams(), index === 0)
    )
}

const shade = 10
const drawAgent = (
  p: p5,
  agent: JsAgent,
  params: FlockParams,
  debug = false
): void => {
  const size = 3

  p.fill(255)

  p.push()
  p.translate(agent.pos.x, agent.pos.y, agent.pos.z)

  p.sphere(size)
  p.pop()
}
