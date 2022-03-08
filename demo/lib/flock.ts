import { SmartMap } from './smartMap'

import { Agent } from './agent'
import { get_flock, advance, set_params } from 'flox'
import { JsFlock } from '../../bindings/JsFlock'
import { JsAgent } from '../../bindings/JsAgent'
import { FlockParams } from '../../bindings/FlockParams'

export class Flock {
  private params: FlockParams<number> = <FlockParams<number>>{}

  getAgents(): JsAgent[] {
    const flock = get_flock(this.params) as JsFlock
    return flock.members
  }

  getParams(): FlockParams<number> {
    return (get_flock(this.params) as JsFlock).params
  }

  applyParams(params: Partial<FlockParams<number>>) {
    Object.assign(this.params, params)

    try {
      set_params(this.params)
    } catch (e: any) {}
  }

  tick() {
    try {
      advance()
    } catch (e) {
      console.warn(e)
    }
  }

  // private updateFlockVelocities(): void {
  //   this.agents.forEach(this.applyForces.bind(this))
  // }

  // private updateFlockPositions(): void {
  //   this.agents.forEach(this.applyVelocities.bind(this))
  // }

  // private updateFlockPopulation(): void {
  //   this.ensurePopulation()
  // }

  // private applyForces(agent: Agent): void {
  //   const neighbors = this.getNeighbors(agent)

  //   const bounding = this.calcBoundingForce(agent)
  //   agent.applyForce(bounding)

  //   if (neighbors.length < 0) {
  //     return
  //   }

  //   const cohesive = this.calcCohesiveForce(agent, neighbors)
  //   agent.applyForce(cohesive)

  //   const alignment = this.calcAlignmentForce(agent, neighbors)
  //   agent.applyForce(alignment)

  //   const separation = this.calcSeparationForce(agent, neighbors)
  //   agent.applyForce(separation)
  // }

  // private applyVelocities(agent: Agent): void {
  //   agent.setMinSpeed(this.params.minSpeed)
  //   agent.setMaxSpeed(this.params.maxSpeed)
  //   agent.setMaxForce(this.params.maxForce)
  //   agent.tick()
  // }

  // ensurePopulation(): void {
  //   const target = this.params.targetPopulation

  //   if (this.agents.length < target) {
  //     this.agents.push(
  //       new Agent(
  //         this.params.minSpeed,
  //         this.params.maxSpeed,
  //         this.params.maxForce
  //       )
  //     )
  //   }

  //   if (this.agents.length > target) {
  //     this.agents.shift()
  //   }
  // }

  // calcBoundingForce(agent: Agent): I3 {
  //   const bounds: I3 = {
  //     x: this.params.boundX,
  //     y: this.params.boundY,
  //     z: this.params.boundZ
  //   }

  //   const target = forAllComponenets((g) => {
  //     const pos = g(agent.pos)
  //     const vel = g(agent.vel)
  //     const fpos = pos + 3 * vel
  //     const bound = g(bounds)
  //     const sign = -1 * (Math.abs(pos) / pos)

  //     if (!(Math.abs(fpos) > bound)) {
  //       return 0
  //     }
  //     return sign * Math.pow(Math.abs(fpos - bound), 2)
  //   })

  //   const steering = sub(target)(agent.vel)
  //   return steering
  // }

  // calcSeparationForce(agent: Agent, neighbors: Agent[]): I3 {
  //   if (neighbors.length === 0) {
  //     return newV3(0, 0, 0)
  //   }

  //   const target = sum(
  //     neighbors.map((n) => {
  //       const delta = sub(n.pos)(agent.pos)
  //       const mag = magSquared(delta)
  //       const scaled = scale(1 / (mag > 0 ? mag : 1))(delta)
  //       return scaled
  //     })
  //   )

  //   const steering = sub(target)(agent.vel)

  //   const separationForce = pipe(
  //     invert,
  //     scale(this.params.separationForce)
  //   )(steering)

  //   return separationForce
  // }

  // calcCohesiveForce(agent: Agent, neighbors: Agent[]) {
  //   if (neighbors.length === 0) {
  //     return newV3(0, 0, 0)
  //   }

  //   const centerOfMass = average(neighbors.map((n) => n.pos))

  //   const target = sub(centerOfMass)(agent.pos)
  //   const steering = sub(target)(agent.vel)

  //   const cohesiveForce = pipe(
  //     normalize,
  //     scale(this.params.cohesiveForce)
  //   )(steering)

  //   return cohesiveForce
  // }

  // calcAlignmentForce(agent: Agent, neighbors: Agent[]): I3 {
  //   if (neighbors.length === 0) {
  //     return newV3(0, 0, 0)
  //   }

  //   const target = average(
  //     neighbors.map((n) => {
  //       // return n.vel
  //       const delta = sub(n.pos)(agent.pos)
  //       const mag = magSquared(delta)
  //       return scale(1 / (mag > 0 ? mag : 1))(n.vel)
  //     })
  //   )

  //   const steering = sub(target)(agent.vel)

  //   const alignmentForce = pipe(
  //     normalize,
  //     scale(this.params.alignmentForce)
  //   )(steering)

  //   return alignmentForce
  // }

  // getNeighbors(agent: Agent, zones?: ZoneCache): Agent[] {
  //   const keys = this.getAgentNeighborChunkKeys(agent)

  //   if (!zones) {
  //     return this.agents.filter(this.isNeighbor(agent))
  //   }

  //   const neighbors = keys
  //     .map((key) => zones.get(key))
  //     .flatMap((set) => Array.from(set))
  //     .filter(this.isNeighbor(agent))

  //   return neighbors

  //   // return Array.from(neighbors).filter(isNeighbor(ctx, agent))
  // }

  // isNeighbor(thisAgent: Agent) {
  //   return (thatAgent: Agent) => {
  //     if (thisAgent.id === thatAgent.id) {
  //       return false
  //     }

  //     const delta = sub(thatAgent.pos)(thisAgent.pos)

  //     if (magnitude(delta) > this.params.viewDistance) {
  //       return false
  //     }

  //     if (angleBetween(delta)(thisAgent.vel) > this.params.viewAngle / 2) {
  //       return false
  //     }

  //     return true
  //   }
  // }

  // updateZoneCache(ctx: Context): ZoneCache {
  //   const zones = new SmartMap<string, Set<Agent>>(() => new Set<Agent>())

  //   ctx.agents.forEach((agent) => {
  //     const chunk = this.getAgentChunkKey(ctx, agent)
  //     zones.get(chunk).add(agent)
  //   })

  //   return zones
  // }

  // getAgentChunk(agent: Agent): I3 {
  //   const resolution = this.params.viewDistance

  //   const chunk: I3 = applyToComponents((c) => Math.floor(c / resolution))(
  //     agent.pos
  //   )

  //   return chunk
  // }

  // getAgentChunkKey(ctx: Context, agent: Agent): string {
  //   return makeKey(this.getAgentChunk(agent))
  // }

  // getAgentNeighborChunkKeys(agent: Agent): string[] {
  //   const offsets = [-1, 0, 1]

  //   const keys = []

  //   const chunk = this.getAgentChunk(agent)

  //   for (const x of offsets) {
  //     for (const y of offsets) {
  //       for (const z of offsets) {
  //         keys.push(makeKey({ x: chunk.x + x, y: chunk.y, z: chunk.z + z }))
  //       }
  //     }
  //   }

  //   return keys
  // }
}

// const makeKey = (i3: I3) => {
//   return `${i3.x}:${i3.y}:${i3.z}`
// }

export type ZoneCache = SmartMap<string, Set<Agent>>
