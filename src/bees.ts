// import p5, { Vector, Element, Color, prototype } from 'p5'

// const {
//   color,
//   createSlider,
//   fill,
//   text,
//   stroke,
//   noStroke,
//   noFill,
//   createVector,
//   createCanvas,
//   arc,
//   line,
//   circle,
//   background,
//   frameCount,
//   PIE,
//   abs
// } = prototype

// const WIDTH = 700
// const HEIGHT = WIDTH / 1.618

// type Canvas = {
//   center: Vector
//   dims: Vector
// }

// const canvas: Canvas = {
//   center: new Vector().add(WIDTH / 2, HEIGHT / 2),
//   dims: new Vector().add(WIDTH, HEIGHT)
// }

// const BACKGROUND_SHADE = 233
// const BEES: Bee[] = []

// // SETUP SLIDERS
// let SPEED_LIMIT: number
// let SPEED_LIMIT_S: Element

// let SPEED_MIN: number
// let SPEED_MIN_S: Element

// let NUM_BEES: number
// let NUM_BEES_S: Element

// let VIEW_DISTANCE: number
// let VIEW_DISTANCE_S: Element

// let DISTANCE_IDEAL: number
// let DISTANCE_IDEAL_S: Element

// let DISTANCE_DESIRE: number
// let DISTANCE_DESIRE_S: Element

// let TURN_SPEED_LIMIT: number
// let TURN_SPEED_LIMIT_S: Element

// let SLIDERS: Element[] = []

// let SLIDER_BASE_COLOR: Color
// let SLIDER_WARNING_COLOR: Color

// // INITIAL CONDITIONS

// const INIT_SPEED_LIMIT = 2
// const INIT_SPEED_MIN = 1
// const INIT_NUM_BEES = 6
// const INIT_VIEW_DISTANCE = 900
// const INIT_DISTANCE_IDEAL = 80
// const INIT_DISTANCE_DESIRE = 0.1
// const INIT_TURN_SPEED_LIMIT = 0.005

// const SLIDER_NAMES = new Map<Element, string>()
// const SLIDER_COLORS = new Map<Element, Color>()

// function createSliders() {
//   SLIDER_BASE_COLOR = color(100)
//   SLIDER_WARNING_COLOR = color(255, 100, 100)

//   NUM_BEES_S = createSlider(0, 100, INIT_NUM_BEES, 1)
//   SLIDER_NAMES.set(NUM_BEES_S, 'BEE COUNT')

//   SPEED_LIMIT_S = createSlider(0, 5, INIT_SPEED_LIMIT, 0.001)
//   SLIDER_NAMES.set(SPEED_LIMIT_S, 'SPEED LIMIT')

//   SPEED_MIN_S = createSlider(0, 30, INIT_SPEED_MIN, 0.001)
//   SLIDER_NAMES.set(SPEED_MIN_S, 'SPEED MIN')

//   VIEW_DISTANCE_S = createSlider(0, WIDTH, INIT_VIEW_DISTANCE)
//   SLIDER_NAMES.set(VIEW_DISTANCE_S, 'VIEW DISTANCE')

//   DISTANCE_DESIRE_S = createSlider(0, 0.3, INIT_DISTANCE_DESIRE, 0.001)
//   SLIDER_NAMES.set(DISTANCE_DESIRE_S, 'DIST. DESIRE')

//   DISTANCE_IDEAL_S = createSlider(0, WIDTH, INIT_DISTANCE_IDEAL)
//   SLIDER_NAMES.set(DISTANCE_IDEAL_S, 'DIST. IDEAL')

//   TURN_SPEED_LIMIT_S = createSlider(0, 0.01, INIT_TURN_SPEED_LIMIT, 0.001)
//   SLIDER_NAMES.set(TURN_SPEED_LIMIT_S, 'TURN SPEED LIMIT')

//   SLIDERS = [
//     NUM_BEES_S,
//     SPEED_MIN_S,
//     SPEED_LIMIT_S,
//     VIEW_DISTANCE_S,
//     DISTANCE_DESIRE_S,
//     DISTANCE_IDEAL_S,
//     TURN_SPEED_LIMIT_S
//   ]

//   SLIDERS.forEach((slider, idx) => {
//     slider.position(10, 20 * idx + 5)
//     SLIDER_COLORS.set(slider, SLIDER_BASE_COLOR)
//   })
// }

// function labelSliders() {
//   SLIDERS.forEach((slider, idx) => {
//     fill(SLIDER_COLORS.get(slider))
//     text(SLIDER_NAMES.get(slider) + ': ' + slider.value(), 150, 20 * idx + 20)
//   })
// }

// function updateSliderValues() {
//   NUM_BEES = Number.parseFloat(NUM_BEES_S.value() as string)
//   SPEED_LIMIT = Number.parseFloat(SPEED_LIMIT_S.value() as string)
//   SPEED_MIN = Number.parseFloat(SPEED_MIN_S.value() as string)
//   VIEW_DISTANCE = Number.parseFloat(VIEW_DISTANCE_S.value() as string)
//   DISTANCE_DESIRE = Number.parseFloat(DISTANCE_DESIRE_S.value() as string)
//   DISTANCE_IDEAL = Number.parseFloat(DISTANCE_IDEAL_S.value() as string)

//   if (SPEED_LIMIT < SPEED_MIN) {
//     SLIDER_COLORS.set(SPEED_LIMIT_S, SLIDER_WARNING_COLOR)
//     SLIDER_COLORS.set(SPEED_MIN_S, SLIDER_WARNING_COLOR)
//   } else {
//     SLIDER_COLORS.set(SPEED_LIMIT_S, SLIDER_BASE_COLOR)
//     SLIDER_COLORS.set(SPEED_MIN_S, SLIDER_BASE_COLOR)
//   }
// }

// function setup() {
//   canvas.dims = createVector(WIDTH, HEIGHT)
//   canvas.center = createVector(WIDTH / 2, HEIGHT / 2)
//   createCanvas(canvas.dims.x, canvas.dims.y)
//   noStroke()
//   createSliders()
// }

// function draw() {
//   background(BACKGROUND_SHADE)

//   BEES.forEach((bee) => bee.updateVel(BEES))

//   BEES.forEach((bee) => bee.updatePos())

//   labelSliders()
//   updateSliderValues()

//   BEES.forEach((bee) => drawBee(bee))

//   drawDebugVels()
// }

// class Bee {
//   pos: Vector
//   vel: Vector

//   constructor(pos: Vector, vel: Vector) {
//     this.pos = pos
//     this.vel = vel
//   }

//   updatePos() {
//     this.pos.add(this.vel)
//     this.pos = vectorMod(this.pos, canvas.dims)
//   }

//   updateVel(bees: Bee[]) {
//     const neighbors = bees.filter((bee) => {
//       const delta = Vector.sub(bee.pos, this.pos)

//       return (
//         bee != this &&
//         this.pos.dist(bee.pos) < VIEW_DISTANCE &&
//         abs(this.vel.angleBetween(delta)) < 0.5
//       )
//     })

//     this.applyIdealDistance(neighbors)

//     // bee speed limit
//     this.vel.limit(SPEED_LIMIT)

//     // bee min speed

//     if (this.vel.mag() <= SPEED_MIN) {
//       this.vel.setMag(SPEED_MIN)
//     }
//   }

//   applyIdealDistance(neighbors: Bee[]) {
//     const attractiveForces = neighbors.map((neighbor) => {
//       const d = this.pos.dist(neighbor.pos)

//       const delta = Vector.sub(neighbor.pos, this.pos)

//       delta.setMag(delta.mag() - DISTANCE_IDEAL)

//       return delta
//     })

//     const turningForce =
//       vectorAverage(attractiveForces).heading() - this.vel.heading()
//     const catchUpForce = vectorAverage(attractiveForces).mag()

//     const limited =
//       turningForce < TURN_SPEED_LIMIT ? turningForce : TURN_SPEED_LIMIT

//     this.vel.rotate(turningForce * DISTANCE_DESIRE)

//     // this.vel.mult(catchUpForce)
//   }
// }

// function sketch(p5: p5) {
//   p5.setup = () => {
//     canvas.dims = createVector(WIDTH, HEIGHT)
//     canvas.center = createVector(WIDTH / 2, HEIGHT / 2)
//     createCanvas(canvas.dims.x, canvas.dims.y)
//     noStroke()
//     createSliders()
//   }
//   p5.draw = draw
// }

// new p5(sketch)

// const vectorAverage = (vecs: Vector[]) => {
//   const z = createVector(0, 0)
//   if (vecs.length === 0) {
//     return z
//   }
//   vecs.forEach((vec) => z.add(vec))
//   z.mult(1 / vecs.length)
//   return z
// }

// const vectorMod = (vecA: Vector, vecB: Vector) => {
//   const x = vecA.x < 0 ? vecA.x + vecB.x : vecA.x % vecB.x
//   const y = vecA.y < 0 ? vecA.y + vecB.y : vecA.y % vecB.y
//   return createVector(x, y)
// }
