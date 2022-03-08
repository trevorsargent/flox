#[cfg(test)]
mod tests {

    use crate::flock::{Flock, FlockParams};

    #[test]
    fn it_makes_new_ones() {
        let params: FlockParams = FlockParams {
            alignment_force: 0.0,
            cohesive_force: 0.0,
            bound_x: 0.0,
            bound_y: 0.0,
            bound_z: 0.0,
            max_speed: 0.0,
            min_speed: 0.0,
            separation_force: 0.0,
            target_population: 100.0,
            view_angle: 0.0,
            view_distance: 0.0,
        };

        let test = Flock::new(&params);

        assert_eq!(
            test.members.lock().unwrap().len(),
            params.target_population as usize
        );
    }
}
