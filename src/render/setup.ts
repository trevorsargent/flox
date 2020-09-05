import { Context, Canvas } from '../types'
import p5 from 'p5'
import { newBee } from '../bee'

export const setup = (p: p5): Context => {
  const WIDTH = 1000
  const HEIGHT = WIDTH / 1.618

  const canvas: Canvas = {
    center: p.createVector(WIDTH / 2, HEIGHT / 2),
    dims: p.createVector(WIDTH, HEIGHT)
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
        ref: p.createSlider(0, 600, 300, 1),
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
        ref: p.createSlider(0, 30, 10, 0),
        name: 'Cohesive Force'
      },
      alignmentForce: {
        ref: p.createSlider(0, 30, 10, 0),
        name: 'Alignment Force'
      },
      separationForce: {
        ref: p.createSlider(0, 30, 10, 0),
        name: 'Separation Force'
      }
    },
    debugOptions: {
      showViewArea: false,
      showVelocityVectors: false
    }
  }

  Object.entries(initialContext.params).forEach(([_, param], idx) => {
    param.ref.position(initialContext.canvas.dims.x + 160, 100 + idx * 30)
  })

  return {
    ...initialContext,
    bees: [newBee(p, initialContext, true)]
  }
}
