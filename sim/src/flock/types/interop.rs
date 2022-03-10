use std::sync::Mutex;

use once_cell::sync::OnceCell;
use serde::{Deserialize, Serialize};
use ts_rs::TS;
use wasm_bindgen::{prelude::wasm_bindgen, throw_str, throw_val, JsValue};

use crate::{
    agent::Agent,
    flock::{Flock, FlockParams},
};

#[derive(TS)]
#[ts(export)]
#[derive(Serialize, Deserialize)]
struct V3 {
    x: f32,
    y: f32,
    z: f32,
}

#[derive(TS)]
#[ts(export)]
#[derive(Serialize, Deserialize)]
struct JsAgent {
    pos: V3,
    vel: V3,
    acc: V3,
}

impl JsAgent {
    fn from_agent(agent: &Agent) -> JsAgent {
        JsAgent {
            pos: V3 {
                x: agent.pos.x,
                y: agent.pos.y,
                z: agent.pos.z,
            },
            vel: V3 {
                x: agent.vel.x,
                y: agent.vel.y,
                z: agent.vel.z,
            },
            acc: V3 {
                x: agent.acc.x,
                y: agent.acc.y,
                z: agent.acc.z,
            },
        }
    }
}

#[derive(TS)]
#[ts(export)]
#[derive(Serialize, Deserialize)]
struct JsFlock {
    members: Vec<JsAgent>,
    params: FlockParams<f32>,
}

impl JsFlock {
    pub fn from_flock(flock: &Flock) -> JsFlock {
        JsFlock {
            members: flock
                .members
                .lock()
                .unwrap()
                .iter()
                .map(|a| JsAgent::from_agent(&a))
                .collect(),
            params: *flock.params.lock().unwrap(),
        }
    }
}

#[allow(dead_code)]
static FLOCK: OnceCell<Mutex<Flock>> = OnceCell::new();

#[wasm_bindgen]
#[allow(dead_code)]
pub fn get_flock(params: JsValue) -> JsValue {
    let deser = params.into_serde();

    if deser.is_err() {
        throw_str("Cannot Deserialize Params")
    }

    let s: FlockParams<f32> = deser.unwrap();

    let flock = &FLOCK.get_or_init(|| Mutex::new(Flock::new(&s))).lock();

    if flock.is_err() {
        throw_str("Error Getting Flock");
    }

    let yes_flock = flock.as_ref().unwrap();

    let js_flock = JsFlock::from_flock(yes_flock);
    let maybe = JsValue::from_serde(&js_flock);

    if maybe.is_err() {
        throw_str("Error mking JsFLock")
    }

    maybe.unwrap()
}

#[wasm_bindgen]
#[allow(dead_code)]
pub fn advance() {
    let mutex = FLOCK.get();

    if mutex.is_none() {
        throw_str("advance - No Flock Yet")
    }

    let flock = mutex.unwrap().lock();

    if flock.is_err() {
        throw_str("advance - No Flock Yet")
    }

    flock.unwrap().advance();
}

#[wasm_bindgen]
#[allow(dead_code)]
pub fn set_params(params: JsValue) {
    let mutex = FLOCK.get();

    if mutex.is_none() {
        throw_str("set_params - No Flock Yet")
    }

    let flock = mutex.unwrap().lock();

    if flock.is_err() {
        throw_str("set_params - No Flock Yet")
    }

    let deser = params.into_serde();

    if deser.is_err() {
        throw_val(params);
    }

    let s = deser.unwrap();

    flock.unwrap().set_params(s);
}
