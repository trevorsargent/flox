use bevy::prelude::*;

struct Agent {
    velocity: Vec3,
}

struct Sim {
    population_target: usize,
}

fn main() {
    App::build()
        .add_plugins(DefaultPlugins)
        .insert_resource(Sim {
            population_target: 5,
        })
        .add_startup_system(setup.system())
        .add_system(population_control.system())
        .add_system(movement.system())
        .run();
}

fn setup(commands: &mut Commands) {
    commands
        // light
        .spawn(LightBundle {
            ..Default::default()
        })
        // camera
        .spawn(PerspectiveCameraBundle {
            transform: Transform::from_xyz(0.0, 15.0, 150.0)
                .looking_at(Vec3::default(), Vec3::unit_y()),
            ..Default::default()
        });
}

fn population_control(
    commands: &mut Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    sim: ResMut<Sim>,
    query: Query<(Entity, &Agent)>,
) {
    let cube_handle = meshes.add(Mesh::from(shape::Cube { size: 1.0 }));

    if query.iter().len() < sim.population_target {
        commands
            .spawn(PbrBundle {
                mesh: cube_handle.clone(),
                ..Default::default()
            })
            .with(Agent {
                velocity: Vec3::new(10.0, 0.0, 0.0),
            });
    }

    if query.iter().len() > sim.population_target {
        let first = query.iter().nth(0);

        if let Some(entity) = first {
            commands.despawn(entity.0);
        }
    }
}

fn movement(time: Res<Time>, mut query: Query<(&Agent, &mut Transform)>) {
    let delta_seconds = f32::min(0.2, time.delta_seconds());

    for (agent, mut transform) in query.iter_mut() {
        transform.translation += agent.velocity * delta_seconds;
        println!("vel! {}", agent.velocity);
        println!("trx! {:?}", transform);
    }
}
