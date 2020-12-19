#[cfg(test)]
mod tests {

    use crate::flock::{Flock, FlockParams};

    #[test]
    fn it_makes_new_ones(){
        let params: FlockParams = FlockParams {
            population: Some(77)
        };

        let test = Flock::new(params.clone());

        match params.population {
            Some(p) => {
                assert_eq!(test.members.len(), p as usize);
            }, 
            None => {}
        }    
    }


}