import * as uuid from 'uuid'
import { newNormalV3, V3 } from '../../lib/v3'

export class Bee {
  id: string
  pos: V3
  vel: V3

  constructor() {
    this.id = uuid.v4()
    this.pos = new V3({ x: 0, y: 0, z: 0 })
    this.vel = new V3(
      newNormalV3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
    )
  }
}
