mod agent_spec;
use vex::Vex;

#[derive(Debug)]
pub struct Agent {
    pos: Vex,
    vel: Vex,
    acc: Vex,
}

pub trait Movement {
    fn advance(&mut self);
}

pub trait Force {
    fn apply_force(&mut self, force: Vex);
}
pub struct AgentParams {
    pub pos: Option<Vex>, 
    pub vel: Option<Vex>,
    pub acc: Option<Vex>
}

impl Agent {
    #[allow(dead_code)]
    pub fn new(params: AgentParams) -> Agent {
        Self {
            pos: match params.pos {
                Some(p) => p,
                None => Vex::new(),
            },
            vel: match params.vel {
                Some(v) => v,
                None => Vex::new(),
            },
            acc: match params.acc {
                Some(a) => a,
                None => Vex::new(),
            },
        }
    }
}

impl Movement for Agent {
    fn advance(&mut self) {
        self.vel.assign(self.vel + self.acc);
        self.pos.assign(self.pos + self.vel);
    }
}

impl Force for Agent {
    fn apply_force(&mut self, force: Vex){
        self.vel.assign(self.vel + force)
    }
}