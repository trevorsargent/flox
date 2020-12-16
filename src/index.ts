import p5, { Element } from 'p5'
import { draw } from './render/draw'
import { Flock, ParamSet } from './types'

interface ParamSliderInfo {
  ref: Element
  name: string
}

function sketch(p: p5) {
  const flock = new Flock()

  let params: ParamSet<ParamSliderInfo>

  p.setup = () => {
    p.createCanvas(1100, 650, p.WEBGL)

    params = {
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
      maxSpeed: {
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
    }

    Object.entries(params).forEach(([_, param], idx, sliders) => {
      const y = 10
      const x = (idx / sliders.length) * 1000
      param.ref.position(x, y)
    })

    // setInterval(() => {
    //   update(ctx)
    // }, 33)
  }

  p.draw = () => {
    flock.update(getUpdateParams(params))
    draw(p, flock.context)
  }

  const getUpdateParams = (
    params: ParamSet<ParamSliderInfo>
  ): ParamSet<number> => {
    return {
      alignmentForce: params.alignmentForce.ref.value() as number,
      cohesiveForce: params.cohesiveForce.ref.value() as number,
      viewDistance: params.viewDistance.ref.value() as number,
      viewAngle: params.viewAngle.ref.value() as number,
      separationForce: params.separationForce.ref.value() as number,
      maxSpeed: params.maxSpeed.ref.value() as number,
      targetPopulation: params.targetPopulation.ref.value() as number
    }
  }
}

new p5(sketch)
