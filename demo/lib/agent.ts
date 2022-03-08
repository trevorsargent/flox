import * as uuid from 'uuid'
import { add, clampMagnitude, I3, newNormalV3, V3 } from './v3'

export class Agent {
  id: string
  readonly pos: V3
  readonly vel: V3
  private acc: V3

  constructor(
    private minSpeed: number,
    private maxSpeed: number,
    private maxForce: number
  ) {
    this.id = uuid.v4()
    this.pos = new V3({ x: 0, y: 0, z: 0 })

    this.vel = new V3(
      newNormalV3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
    )

    this.acc = new V3({ x: 0, y: 0, z: 0 })
  }

  setMinSpeed(min: number) {
    this.minSpeed = min
  }

  setMaxSpeed(max: number) {
    this.maxSpeed = max
  }

  setMaxForce(max: number) {
    this.maxForce = max
  }

  tick() {
    const acc = clampMagnitude(0)(this.maxForce)(this.acc)

    const vel = clampMagnitude(this.minSpeed)(this.maxSpeed)(add(this.vel)(acc))
    this.vel.set(vel)
    this.pos.set(add(this.pos)(this.vel))
    this.resetAcceleration()
  }

  applyForce(force: I3) {
    this.acc.set(add(this.acc)(force))
  }

  private resetAcceleration() {
    this.acc.set({ x: 0, y: 0, z: 0 })
  }
}
