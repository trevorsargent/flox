import p5 from 'p5'
import { draw } from './render/draw'
import { setup } from './render/setup'
import { Context } from './types'
import { update } from './render/update'

function sketch(p: p5) {
  const ctx: Context = {} as Context

  p.setup = () => {
    setup(ctx, p)
    update(ctx)
    // setInterval(() => {
    //   update(ctx)
    // }, 33)
  }

  p.draw = () => {
    update(ctx)
    draw(p, ctx)
  }
}

new p5(sketch)
