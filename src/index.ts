import p5 from 'p5'
import { draw } from './render/draw'
import { setup } from './render/setup'
import { Context } from './types'
import { update } from './render/update'

function sketch(p: p5) {
  let ctx: Context

  p.setup = () => {
    ctx = setup(p)
  }

  p.draw = () => {
    ctx = update(p, ctx)
    draw(p, ctx)
  }
}

new p5(sketch)
