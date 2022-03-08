mod agent_spec;

use vex::Vector3;

#[derive(Debug)]
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

pub struct AgentParams {
    pub pos: Option<Vector3>,
    pub vel: Option<Vector3>,
    pub acc: Option<Vector3>,
}

impl Agent {
    #[allow(dead_code)]
    pub fn new(params: AgentParams) -> Agent {
        Self {
            pos: match params.pos {
                Some(p) => p,
                None => Vector3::new(),
            },
            vel: match params.vel {
                Some(v) => v,
                None => Vector3::new(),
            },
            acc: match params.acc {
                Some(a) => a,
                None => Vector3::new(),
            },
        }
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
        self.vel = self.vel + force;
    }
}
