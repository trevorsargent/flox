#[cfg(test)]
use crate::agent::*;

#[test]
fn it_can_make_a_new_agent() {
    let agent = Agent::new(AgentParams {
        pos: Some(Vector3 {
            x: 0_f32,
            y: 0_f32,
            z: 0_f32,
        }),
        vel: Some(Vector3 {
            x: 0_f32,
            y: 1_f32,
            z: 2_f32,
        }),
        acc: None,
    });

    assert_eq!(agent.pos.z, 0_f32);
    assert_eq!(agent.vel.y, 1_f32);
}

#[test]
fn it_moves() {
    let mut agent = Agent::new(AgentParams {
        pos: Some(Vector3 {
            x: 1.5,
            y: 2.5,
            z: 3.5,
        }),
        vel: Some(Vector3 {
            x: 0.5,
            y: 0.5,
            z: 0.5,
        }),
        acc: None,
    });

    agent.advance();

    assert_eq!(
        agent.pos,
        Vector3 {
            x: 2.0,
            y: 3.0,
            z: 4.0
        }
    );

    agent.advance();

    assert_eq!(
        agent.pos,
        Vector3 {
            x: 2.5,
            y: 3.5,
            z: 4.5
        }
    )
}

#[test]
fn it_accelerates() {
    let mut agent = Agent::new(AgentParams {
        pos: Some(Vector3 {
            x: 1.0,
            y: 1.0,
            z: 1.0,
        }),
        vel: Some(Vector3 {
            x: 1.0,
            y: 0.0,
            z: 0.0,
        }),
        acc: Some(Vector3 {
            x: 0.5,
            y: 0.0,
            z: 0.0,
        }),
    });

    agent.advance();

    assert_eq!(agent.vel.x, 1.5);
    assert_eq!(agent.pos.x, 2.5);

    agent.advance();

    assert_eq!(agent.vel.x, 2.0);
    assert_eq!(agent.pos.x, 4.5);

    agent.advance();

    assert_eq!(agent.vel.x, 2.5);
    assert_eq!(agent.pos.x, 7.0);
}
