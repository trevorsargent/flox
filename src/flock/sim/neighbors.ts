import { SmartMap } from '../../lib/smartMap'
import {
  angleBetween,
  applyToComponents,
  I3,
  magnitude,
  sub
} from '../../lib/v3'
import { Agent } from '../types/agent'
import { Context } from '../types/flock'

export const getNeighbors = (ctx: Context, agent: Agent): Agent[] => {
  const chunk = getAgentChunk(ctx, agent)

  const neighbors = new Set<Agent>()

  // for (let x = chunk.x - 1; x <= chunk.x + 1; x++) {
  //   for (let y = chunk.y - 1; y <= chunk.y + 1; y++) {
  //     for (let z = chunk.z - 1; z <= chunk.y + 1; z++) {
  //       for (const b of ctx.zones
  //         .originalGet(x)
  //         ?.originalGet(y)
  //         ?.originalGet(z)
  //         ?.values() ?? []) {
  //         neighbors.add(b)
  //       }
  //     }
  //   }
  // }

  return ctx.agents.filter(isNeighbor(ctx, agent))

  // return Array.from(neighbors).filter(isNeighbor(ctx, agent))
}

const isNeighbor = (ctx: Context, thisAgent: Agent) => (thatAgent: Agent) => {
  if (thisAgent.id === thatAgent.id) {
    return false
  }

  const delta = sub(thatAgent.pos)(thisAgent.pos)

  if (magnitude(delta) > ctx.params.viewDistance) {
    return false
  }

  if (angleBetween(delta)(thisAgent.vel) > ctx.params.viewAngle / 2) {
    return false
  }

  return true
}

export const updateZoneCache = (ctx: Context): void => {
  ctx.zones = undefined

  ctx.zones = new SmartMap( // x
    () =>
      new SmartMap( // y
        () =>
          new SmartMap( // z
            () => new Set<Agent>() // there they are!
          )
      )
  )

  ctx.agents.forEach((agent) => {
    const chunk = getAgentChunk(ctx, agent)
    ctx.zones.get(chunk.x).get(chunk.y).get(chunk.z).add(agent)
  })
}

function getAgentChunk(ctx: Context, agent: Agent): I3 {
  const resolution = ctx.params.viewDistance

  const chunk: I3 = applyToComponents((c) => Math.floor(c / resolution))(
    agent.pos
  )

  return chunk
}
