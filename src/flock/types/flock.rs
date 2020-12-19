use crate::agent::{Agent, AgentParams};
mod flock_spec;

#[derive(Default, Clone)]
struct FlockParams {
    population: Option<i32>
}

struct Flock {
    #[allow(dead_code)]
    members: Vec<Agent>
}

impl Flock {
    #[allow(dead_code)]
    pub fn new(params: FlockParams) -> Self {

        let mut members = Vec::new();

        match params.population {
            Some(pop) => {
                    for _ in 0..pop {
                        members.push(Agent::new(AgentParams {pos: None, vel: None, acc: None}))
                    }
            },
            None => {},
        }

        Self {
            members,
        }
    }
}


