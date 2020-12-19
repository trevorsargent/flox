mod agent_test;
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

impl Agent {
    #[allow(dead_code)]
    pub fn new(pos: Option<Vex>, vel: Option<Vex>, acc: Option<Vex>) -> Agent {
        Self {
            pos: match pos {
                Some(p) => p,
                None => Vex::new(),
            },
            vel: match vel {
                Some(v) => v,
                None => Vex::new(),
            },
            acc: match acc {
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