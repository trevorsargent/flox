import p5, { Element } from 'p5'
import Flock, { ParamSet } from '..'
import { draw } from './draw'

interface ParamSliderInfo {
  min: number
  max: number
  init: number
  step: number
  name: string
}

function sketch(p: p5) {
  const flock = new Flock()

  let params: { [index: string]: ParamSliderInfo }

  p.setup = () => {
    p.createCanvas(window.innerWidth - 200, window.innerHeight, p.WEBGL)

    params = <ParamSet<ParamSliderInfo>>{
      targetPopulation: {
        min: 10,
        max: 250,
        init: 80,
        step: 1,
        name: 'Target Population'
      },
      viewDistance: {
        min: 0,
        max: 200,
        init: 100,
        step: 1,
        name: 'View Distance'
      },
      viewAngle: {
        min: 0,
        max: p.PI * 2,
        init: p.PI / 2,
        step: 0,
        name: 'View Angle'
      },
      minSpeed: {
        min: 0,
        max: 10,
        init: 2,
        step: 0,
        name: 'Min Speed'
      },
      maxSpeed: {
        min: 5,
        max: 20,
        init: 10,
        step: 0,
        name: 'Max Speed'
      },
      maxForce: {
        min: 2,
        max: 20,
        init: 2,
        step: 0,
        name: 'Max Force'
      },
      cohesiveForce: {
        min: 0,
        max: 1,
        init: 0.25,
        step: 0,
        name: 'Cohesive Force'
      },
      alignmentForce: {
        min: 0,
        max: 1,
        init: 0.25,
        step: 0,
        name: 'Alignment Force'
      },
      separationForce: {
        min: 0,
        max: 1,
        init: 0.25,
        step: 0,
        name: 'Separation Force'
      },
      boundX: {
        min: 0,
        max: 400,
        init: 200,
        step: 1,
        name: 'BoundsX'
      },
      boundY: {
        min: 0,
        max: 400,
        init: 200,
        step: 1,
        name: 'BoundsY'
      },
      boundZ: {
        min: 0,
        max: 400,
        init: 200,
        step: 1,
        name: 'BoundsZ'
      }
    }

    const ctrls = document.getElementById('controls')

    Object.entries(params).forEach(([key, param], idx, sliders) => {
      const div = document.createElement('div')
      div.style.padding = '3px'

      const slider = document.createElement('INPUT') as HTMLInputElement
      slider.setAttribute('type', 'range')
      slider.setAttribute('step', param.step > 0 ? `${param.step}` : 'any')
      slider.setAttribute('min', `${param.min}`)
      slider.setAttribute('max', `${param.max}`)
      slider.setAttribute('value', `${param.init}`)

      const label = document.createElement('p')
      label.innerText = param.name
      label.style.marginBottom = '2px'
      label.style.marginTop = '10px'

      const indicator = document.createElement('span')
      indicator.innerText = Number.parseFloat(param.init.toString()).toFixed(2)
      indicator.style.float = 'right'

      div.appendChild(indicator)
      div.appendChild(label)
      div.appendChild(slider)

      ctrls.appendChild(div)

      flock.applyParams({
        [key]: param.init
      })

      slider.oninput = function () {
        const v = Number.parseFloat((this as any).value)
        indicator.innerText = v.toFixed(2)
        flock.applyParams({
          [key]: v
        })
      }
    })
  }

  p.draw = () => {
    flock.tick()
    draw(p, flock.context)
  }
}

new p5(sketch)
