#[cfg(test)]
mod tests {
    use crate::agent::*;
    #[test]
    fn it_can_make_a_new_agent() {
        let agent = Agent::new(
            Some(Vex {
                x: 0_f64,
                y: 0_f64,
                z: 0_f64,
            }),
            Some(Vex {
                x: 0_f64,
                y: 1_f64,
                z: 2_f64,
            }),
            None,
        );

        assert_eq!(agent.pos.z, 0_f64);
        assert_eq!(agent.vel.y, 1_f64);
    }
}
