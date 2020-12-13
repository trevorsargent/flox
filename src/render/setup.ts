import { Context, Canvas } from '../types'
import p5 from 'p5'
import { newBee } from '../bee'
import { newV3 } from '../lib/v3'

export const setup = (ctx: Context, p: p5): void => {
  const WIDTH = 1000
  const HEIGHT = WIDTH / 1.618

  const canvas: Canvas = {
    center: newV3(0,0, 0),
    dims: newV3(WIDTH, HEIGHT, 0)
  }

  p.createCanvas(canvas.dims.x, canvas.dims.y, p.WEBGL)

  const initialContext: Context = {
    bees: [],
    canvas,
    params: {
      targetPopulation: {
        ref: p.createSlider(0, 250, 150, 1),
        name: 'Target Population',
        cache: null
      },
      viewDistance: {
        ref: p.createSlider(0, 600, 200, 1),
        name: 'View Distance',
        cache: null
      },
      viewAngle: {
        ref: p.createSlider(0, p.PI * 2, p.PI, 0),
        name: 'View Angle',
        cache: null
      },
      speedMultiplier: {
        ref: p.createSlider(0, 10, 5, 0),
        name: 'Speed',
        cache: null
      },
      cohesiveForce: {
        ref: p.createSlider(0, 30, 5, 0),
        name: 'Cohesive Force',
        cache: null
      },
      alignmentForce: {
        ref: p.createSlider(0, 30, 10, 0),
        name: 'Alignment Force',
        cache: null
      },
      separationForce: {
        ref: p.createSlider(0, 30, 15, 0),
        name: 'Separation Force',
        cache: null
      }
    },
    debugOptions: {
      showViewArea: false,
      showVelocityVectors: false
    },
    zones: undefined
  }

  Object.entries(initialContext.params).forEach(([_, param], idx, sliders) => {
    const y = initialContext.canvas.dims.y - 10;
    const x = idx / sliders.length * initialContext.canvas.dims.x 

    param.ref.position(x, y)
  })

  Object.assign(ctx, initialContext)
  ctx.bees.push(newBee(initialContext))

}
