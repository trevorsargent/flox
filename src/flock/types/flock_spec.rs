#[cfg(test)]
mod tests {
    use crate::flock::{Flock, FlockParams};

    #[test]
    fn it_makes_new_ones() {
        let _ = Flock::new(&FlockParams::default());
    }
}
