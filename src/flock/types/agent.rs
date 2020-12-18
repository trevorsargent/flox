mod agent_test;
use vex::Vex;

#[derive(Debug)]
pub struct Agent {
    pos: Vex,
    vel: Vex,
    acc: Vex,
}

pub trait Movement {
    fn advance(self);
}

pub trait Force {
    fn apply_force(self, force: Vex);
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
    fn advance(mut self) {
        self.pos.assign(self.pos + self.vel);
    }
}
