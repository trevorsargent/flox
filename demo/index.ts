import p5, { Element } from 'p5'
import Flock, { ParamSet } from '..'
import { draw } from './draw'

interface ParamSliderInfo {
  ref: Element
  name: string
}

function sketch(p: p5) {
  const flock = new Flock()

  let params: { [index: string]: ParamSliderInfo }

  p.setup = () => {
    p.createCanvas(1100, 650, p.WEBGL)

    params = {
      targetPopulation: {
        ref: p.createSlider(10, 250, 80, 1),
        name: 'Target Population'
      },
      viewDistance: {
        ref: p.createSlider(0, 200, 100, 1),
        name: 'View Distance'
      },
      viewAngle: {
        ref: p.createSlider(0, p.PI * 2, p.PI / 2, 0),
        name: 'View Angle'
      },
      maxSpeed: {
        ref: p.createSlider(5, 20, 10, 0),
        name: 'Speed'
      },
      cohesiveForce: {
        ref: p.createSlider(0, 1, .2, 0),
        name: 'Cohesive Force'
      },
      alignmentForce: {
        ref: p.createSlider(0, 1, .8, 0),
        name: 'Alignment Force'
      },
      separationForce: {
        ref: p.createSlider(0, 1, .3, 0),
        name: 'Separation Force'
      },
      boundX: {
        ref: p.createSlider(0, 400, 200, 1),
        name: 'BoundsX'
      },
      boundY: {
        ref: p.createSlider(0, 400, 200, 1),
        name: 'BoundsY'
      },
      boundZ: {
        ref: p.createSlider(0, 400, 200, 1),
        name: 'BoundsZ'
      }
    }

    Object.entries(params).forEach(([_, param], idx, sliders) => {
      const y = 10
      const x = (idx / sliders.length) * window.innerWidth
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

  const getUpdateParams = (params: {
    [index: string]: ParamSliderInfo
  }): ParamSet<number> => {
    return {
      alignmentForce: params.alignmentForce.ref.value() as number,
      cohesiveForce: params.cohesiveForce.ref.value() as number,
      viewDistance: params.viewDistance.ref.value() as number,
      viewAngle: params.viewAngle.ref.value() as number,
      separationForce: params.separationForce.ref.value() as number,
      maxSpeed: params.maxSpeed.ref.value() as number,
      targetPopulation: params.targetPopulation.ref.value() as number,
      bounds: {
        x: params.boundX.ref.value() as number,
        y: params.boundY.ref.value() as number,
        z: params.boundZ.ref.value() as number
      }
    }
  }
}

new p5(sketch)
