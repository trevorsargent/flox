mod flock_spec;

use std::{collections::HashMap, f32::consts::PI, fmt::Debug, mem, sync::Mutex};

use serde::{Deserialize, Serialize};
use ts_rs::TS;
use vex::Vector3;

use crate::agent::{Agent, AgentParams, Movement, Neighborly};

#[derive(TS)]
#[ts(export)]
#[derive(Serialize, Deserialize, Clone, Copy, Debug)]
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
    pub use_chunks: bool,
    pub chunk_size: T,
}

impl Default for FlockParams {
    fn default() -> Self {
        FlockParams {
            alignment_force: 0.3,
            bound_x: 250.0,
            bound_y: 250.0,
            bound_z: 250.0,
            cohesive_force: 0.3,
            max_force: 1.0,
            max_speed: 2.0,
            min_speed: 1.0,
            separation_force: 0.5,
            target_population: 250.0,
            view_angle: PI / 2.0,
            view_distance: 50.0,
            use_chunks: false,
            chunk_size: 1.5,
        }
    }
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
        if self.params.lock().unwrap().use_chunks {
            self.advance_agents_with_chunks();
            return;
        }

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

    fn advance_agents_with_chunks(&self) {
        let mut members = self.members.lock().unwrap();

        let chunk_size = self.params.lock().unwrap().view_distance * 1.05;

        let cache = build_chunk_cache(&members, chunk_size);

        for agent in members.iter_mut() {
            let neighborhood = make_neighborhood_keys(&agent.pos, chunk_size);

            let candidates = neighborhood.iter().fold(Vec::<Agent>::new(), |mut s, a| {
                let maybe_local = cache.get(a);
                if maybe_local.is_none() {
                    return s;
                }
                s.append(&mut maybe_local.unwrap().clone());
                s
            });

            let neighbors = candidates
                .into_iter()
                .filter(|a| a.is_neighbor(&agent, &self.params.lock().unwrap()))
                .collect();

            agent.update_forces(&self.params.lock().unwrap(), neighbors);
            agent.advance(&self.params.lock().unwrap())
        }
    }
}

type ChunkCache = HashMap<(i32, i32, i32), Vec<Agent>>;

fn build_chunk_cache(agents: &Vec<Agent>, chunk_size: f32) -> ChunkCache {
    let mut cache = HashMap::new();

    for agent in agents.iter() {
        let key = make_chunk_key(&agent.pos, chunk_size);

        if !cache.contains_key(&key) {
            cache.insert(key, Vec::<Agent>::new());
        }

        let agent = agent.clone();

        cache.get_mut(&key).unwrap().push(agent);
    }
    cache
}

fn make_chunk_key(location: &Vector3, chunk_size: f32) -> (i32, i32, i32) {
    let chunk = *location / chunk_size;
    let chunk_x = chunk.x.round() as i32;
    let chunk_y = chunk.y.round() as i32;
    let chunk_z = chunk.z.round() as i32;

    (chunk_x, chunk_y, chunk_z)
}

fn make_neighborhood_keys(location: &Vector3, chunk_size: f32) -> Vec<(i32, i32, i32)> {
    let home = make_chunk_key(location, chunk_size);

    let mut keys = vec![];

    for x in -1..1 {
        for y in -1..1 {
            for z in -1..1 {
                keys.push((home.0 + x, home.1 + y, home.2 + z))
            }
        }
    }

    return keys;
}
