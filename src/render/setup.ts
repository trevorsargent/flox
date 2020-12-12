import { Context, Canvas } from '../types'
import p5 from 'p5'
import { newBee } from '../bee'
import { newV3 } from '../lib/v3'

export const setup = (p: p5): Context => {
  const WIDTH = 1000
  const HEIGHT = WIDTH / 1.618

  const canvas: Canvas = {
    center: newV3(WIDTH / 2, HEIGHT / 2, 0),
    dims: newV3(WIDTH, HEIGHT, 0)
  }

  p.createCanvas(canvas.dims.x, canvas.dims.y)


  const initialContext: Context = {
    bees: [],
    canvas,
    params: {
      targetPopulation: {
        ref: p.createSlider(0, 250, 150, 1),
        name: 'Target Population'
      },
      viewDistance: {
        ref: p.createSlider(0, 600, 200, 1),
        name: 'View Distance'
      },
      viewAngle: {
        ref: p.createSlider(0, p.PI * 2, p.PI, 0),
        name: 'View Angle'
      },
      speedMultiplier: {
        ref: p.createSlider(0, 10, 5, 0),
        name: 'Speed'
      },
      cohesiveForce: {
        ref: p.createSlider(0, 30, 5, 0),
        name: 'Cohesive Force'
      },
      alignmentForce: {
        ref: p.createSlider(0, 30, 10, 0),
        name: 'Alignment Force'
      },
      separationForce: {
        ref: p.createSlider(0, 30, 15, 0),
        name: 'Separation Force'
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

  const ctx =  {
    ...initialContext,
    bees: [newBee(initialContext)]
  }

  return ctx
}
