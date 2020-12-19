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

    #[test]
    fn it_moves(){
        let mut agent = Agent::new(
            Some(Vex {
                x: 1.5, 
                y: 2.5, 
                z: 3.5, 
            }), 
            Some(Vex {
                x: 0.5, 
                y: 0.5, 
                z: 0.5
            }), None
        );

        agent.advance();

        assert_eq!(agent.pos, Vex { x: 2.0, y: 3.0, z: 4.0});

        agent.advance();

        assert_eq!(agent.pos, Vex {x: 2.5, y: 3.5, z: 4.5})
    }

    #[test]
    fn it_accelerates(){
        let mut agent = Agent::new(
            Some(Vex {
                x: 1.0, 
                y: 1.0, 
                z: 1.0
            }), 
            Some(Vex {
                x: 1.0, 
                y: 0.0, 
                z: 0.0,
            }), 
            Some(Vex {
                x: 0.5, 
                y: 0.0, 
                z: 0.0, 
            })
        );

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
}
