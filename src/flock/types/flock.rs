mod flock_spec;

use std::{mem, sync::Mutex};

use serde::{Deserialize, Serialize};
use ts_rs::TS;

use crate::agent::{Agent, AgentParams, Movement, Neighborly};

#[derive(TS)]
#[ts(export)]
#[derive(Serialize, Deserialize, Default, Clone, Copy, Debug)]
pub struct FlockParams<T = f32> {
    pub target_population: T,
    pub view_distance: T,
    pub view_angle: T,
    pub max_force: T,
    pub max_speed: T,
    pub min_speed: T,
    pub cohesive_force: T,
    pub separation_force: T,
    pub alignment_force: T,
    pub bound_x: T,
    pub bound_y: T,
    pub bound_z: T,
}

pub struct Flock {
    #[allow(dead_code)]
    pub members: Mutex<Vec<Agent>>,
    pub params: Mutex<FlockParams<f32>>,
}

impl Flock {
    #[allow(dead_code)]
    pub fn new(params: &FlockParams) -> Self {
        let members = Mutex::new(Vec::new());

        for _ in 0..params.target_population as i32 {
            members.lock().unwrap().push(Agent::new(AgentParams {
                pos: None,
                vel: None,
                acc: None,
            }))
        }

        Self {
            members,
            params: Mutex::new(*params),
        }
    }

    #[allow(dead_code)]
    pub fn set_params(&self, params: FlockParams) -> FlockParams {
        mem::replace(self.params.lock().as_mut().unwrap(), params)
    }

    #[allow(dead_code)]
    pub fn advance(&self) {
        self.control_population();
        self.advance_agents();
    }

    fn control_population(&self) {
        if self.members.lock().unwrap().len()
            < self.params.lock().unwrap().target_population as usize
        {
            self.members.lock().unwrap().push(Agent::new(AgentParams {
                acc: None,
                pos: None,
                vel: None,
            }))
        }

        if self.members.lock().unwrap().len()
            > self.params.lock().unwrap().target_population as usize
        {
            self.members.lock().unwrap().pop();
        }
    }

    fn advance_agents(&self) {
        let mut members = self.members.lock().unwrap();
        let members_copy = members.to_vec();

        for agent in members.iter_mut() {
            let local_copy = members_copy.to_vec();
            let neighbors = local_copy
                .into_iter()
                .filter(|a| a.is_neighbor(&agent, &self.params.lock().unwrap()))
                .collect();

            agent.update_forces(&self.params.lock().unwrap(), neighbors);
            agent.advance(&self.params.lock().unwrap())
        }
    }
}
