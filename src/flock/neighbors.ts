import { uniq } from "ramda"
import { heading2d, magnitude, sub } from "../lib/v3"
import { Bee, Context, ZoneCache } from "../types"

export const clamp = (min: number, max: number, value: number) => {
    if(value < min){
        return min
    }

    if(value >= max){
        return max -1
    }
    return value
}

export const getNeighbors = (ctx: Context, bee: Bee): Bee[] => {

    const {numHorzChunks, numVertChunks, chunkH, chunkW} = getChunkInfo(ctx)

    const {chunkX, chunkY} = getBeeChunk(bee, chunkW, chunkH)

    const xOffset = bee.vel.x > 0 ? 1 : -1
    const yOffset = bee.vel.y > 0 ? 1 : -1

    const xs = uniq([clamp(0, numHorzChunks, chunkX + xOffset), chunkX])
    const ys = uniq([clamp(0, numVertChunks, chunkY + yOffset), chunkY])

    // console.log("get Neighbors", ctx.zones)

     const neighbors = xs.map(x => {
       return ys.map(y => {
            // console.log(x, y)
            return ctx.zones[x][y].map(idx => ctx.bees[idx])
        }).flat()
    }).flat().filter(isNeighborBee(ctx, bee))


    return neighbors

}

const isNeighborBee = (ctx: Context, thisBee: Bee) => (thatBee: Bee) => {
    if (thisBee.id === thatBee.id) {
      return false
    }
  
    const delta = sub(thatBee.pos)(thisBee.pos)
  
    if (magnitude(delta) > ctx.params.viewDistance.ref.value()) {
      return false
    }
  
    if (
      Math.abs(heading2d(delta) - heading2d(thisBee.vel)) >
      (ctx.params.viewAngle.ref.value() as number) / 2
    ) {
      return false
    }
  
    return true
  }

  export const updateZoneCache = (ctx: Context): Context => {
    const { numHorzChunks, numVertChunks, chunkW, chunkH } = getChunkInfo(ctx)

    const cache: ZoneCache = new Array(numHorzChunks).fill(null).map(_ => new Array(numVertChunks).fill([]))
    ctx.bees.forEach((bee, idx) => {

        const { chunkX, chunkY } = getBeeChunk(bee, chunkW, chunkH)
     
        cache[chunkX][chunkY].push(idx)
    })
    return {
        ...ctx,
        zones: cache
    }

  }

function getBeeChunk(bee: Bee, chunkW: number, chunkH: number) {


    const chunkX = Math.floor(bee.pos.x / chunkW)
    const chunkY = Math.floor(bee.pos.y / chunkH)
    return { chunkX, chunkY }
}

function getChunkInfo(ctx: Context) {
    const width = ctx.canvas.dims.x
    const height = ctx.canvas.dims.y
    const viewDistance = ctx.params.viewDistance.ref.value() as number

    const numHorzChunks = Math.floor(width / viewDistance)
    const numVertChunks = Math.floor(height / viewDistance)

    const chunkW = width / numHorzChunks
    const chunkH = height / numVertChunks
    return { numHorzChunks, numVertChunks, chunkW, chunkH }
}
