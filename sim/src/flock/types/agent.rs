mod agent_spec;

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
    fn advance(&mut self, params: &FlockParams);
}

pub trait Force {
    fn apply_force(&mut self, force: Vector3, params: &FlockParams);
}

pub trait Neighborly {
    fn is_neighbor(&self, other: &Self, params: &FlockParams) -> bool;
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
                    let mut v = Vector3 {
                        x: rng.gen(),
                        y: rng.gen(),
                        z: rng.gen(),
                    } - 0.5;
                    v.norm();
                    let rand: f32 = rng.gen();
                    v * (rand + 0.5)
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
        self.acc = Vector3::new();
        self.bounding_force(params);
        self.cohesive_force(params, &neighbors);
        self.separation_force(params, &neighbors);
        self.alignment_force(params, &neighbors);
    }

    fn cohesive_force(&mut self, params: &FlockParams, neighbors: &Vec<Agent>) {
        let num_neighbors = neighbors.len() as f32;

        if num_neighbors == 0.0 {
            return;
        }

        let center_of_mass = neighbors.iter().fold(Vector3::new(), |acc, el| {
            let delta = el.pos - self.pos;

            acc + (el.pos / delta.mag_sq())
        }) / num_neighbors;

        let desired = center_of_mass - self.pos;

        let mut steering = desired - self.vel;
        steering *= params.cohesive_force;
        self.apply_force(steering, params);
    }

    fn separation_force(&mut self, params: &FlockParams, neighbors: &Vec<Agent>) {
        let num_neighbors = neighbors.len() as f32;

        if num_neighbors == 0.0 {
            return;
        }

        let desired = neighbors.iter().fold(Vector3::new(), |acc, el| {
            let delta = self.pos - el.pos;
            acc + delta
        });

        let mut steering = desired - self.vel;
        steering *= params.separation_force;
        self.apply_force(steering, params);
    }

    fn alignment_force(&mut self, params: &FlockParams, neighbors: &Vec<Agent>) {
        let num_neighbors = neighbors.len() as f32;

        if num_neighbors == 0.0 {
            return;
        }

        let desired = neighbors
            .iter()
            .fold(Vector3::new(), |acc, el| acc + el.vel)
            / num_neighbors;

        let mut steering = desired - self.vel;
        steering *= params.alignment_force;
        self.apply_force(steering, params);
    }

    fn bounding_force(&mut self, params: &FlockParams) {
        if self.pos.x.abs() > params.bound_x {
            let sign = self.pos.x.abs() / self.pos.x;

            self.apply_force(
                Vector3 {
                    x: sign * -1.0,
                    y: 0.0,
                    z: 0.0,
                },
                params,
            );
        }

        if self.pos.y.abs() > params.bound_y {
            let sign = self.pos.y.abs() / self.pos.y;

            self.apply_force(
                Vector3 {
                    x: 0.0,
                    y: sign * -1.0,
                    z: 0.0,
                },
                params,
            );
        }

        if self.pos.z.abs() > params.bound_z {
            let sign = self.pos.z.abs() / self.pos.z;
            self.apply_force(
                Vector3 {
                    y: 0.0,
                    x: 0.0,
                    z: sign * -1.0,
                },
                params,
            );
        }
    }
}

impl Movement for Agent {
    fn advance(&mut self, params: &FlockParams) {
        self.vel = limit(self.vel, params.min_speed, params.max_speed);

        self.vel = self.vel + self.acc;
        self.pos = self.pos + self.vel;
    }
}

impl Force for Agent {
    fn apply_force(&mut self, force: Vector3, params: &FlockParams) {
        self.acc = self.acc + limit(force, 0.0, params.max_force);
    }
}

impl Neighborly for Agent {
    fn is_neighbor(&self, other: &Agent, params: &FlockParams) -> bool {
        let delta = other.pos - self.pos;

        let dot = Vector3::dot(&delta, &self.vel);
        let dist = delta.mag();
        let angle = (dot / dist).acos();

        (dist < params.view_distance) && (angle < params.view_angle)
    }
}

fn limit(vec: Vector3, _min_mag: f32, max_mag: f32) -> Vector3 {
    let mag = vec.mag();
    let mut copy = vec.clone();

    if mag > max_mag {
        copy.norm();
        copy *= max_mag;
    }

    // if mag < min_mag {
    //     copy.norm();
    //     copy *= min_mag;
    // }
    copy
}
