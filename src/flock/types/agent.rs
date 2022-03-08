mod agent_spec;

use std::ops::Mul;

use crate::flock::FlockParams;
use vex::Vector3;

use rand::prelude::*;

#[derive(Debug, Clone, Copy)]
pub struct Agent {
    pub pos: Vector3,
    pub vel: Vector3,
    pub acc: Vector3,
}

pub trait Movement {
    fn advance(&mut self);
}

pub trait Force {
    fn apply_force(&mut self, force: Vector3);
}

pub trait Neighborly {
    fn is_neighbor(&self, other: &Self) -> bool;
}

pub struct AgentParams {
    pub pos: Option<Vector3>,
    pub vel: Option<Vector3>,
    pub acc: Option<Vector3>,
}

impl Agent {
    #[allow(dead_code)]
    pub fn new(params: AgentParams) -> Agent {
        let mut rng = ThreadRng::default();
        Self {
            pos: match params.pos {
                Some(p) => p,
                None => Vector3 {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0,
                },
            },
            vel: match params.vel {
                Some(v) => v,
                None => {
                    Vector3 {
                        x: rng.gen(),
                        y: rng.gen(),
                        z: rng.gen(),
                    } - 0.5
                }
            },
            acc: match params.acc {
                Some(a) => a,
                None => Vector3 {
                    x: 0.0,
                    y: 0.0,
                    z: 0.0,
                },
            },
        }
    }

    pub fn update_forces(&mut self, params: &FlockParams, neighbors: Vec<Agent>) {
        self.apply_force(self.pos * -0.001);

        self.vel.mul(3.0);
    }
}

impl Movement for Agent {
    fn advance(&mut self) {
        self.vel = self.vel + self.acc;
        self.pos = self.pos + self.vel;
    }
}

impl Force for Agent {
    fn apply_force(&mut self, force: Vector3) {
        let mut mut_force = force.clone();

        self.vel = self.vel + mut_force;
        self.vel.norm();
    }
}

impl Neighborly for Agent {
    fn is_neighbor(&self, other: &Agent) -> bool {
        true
    }
}
