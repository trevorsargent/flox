use std::collections::HashMap;

use sim::flock::{Flock, FlockParams};
use three::Object;

extern crate three;

pub fn main() {
    render();
}

pub fn render() {
    let mut meshes: HashMap<usize, three::Mesh> = HashMap::new();

    let mut params = FlockParams {
        target_population: 2000.0,
        view_distance: 40.0,
        use_chunks: true,
        chunk_size: 1.5,
        ..FlockParams::default()
    };
    let flock = Flock::new(&params);

    let mut window = three::Window::new("Getting started with three-rs");

    let fov = 60.0;
    let zrange = 0.1..1000.0;
    let camera = window.factory.perspective_camera(fov, zrange);

    camera.set_position([0.0, 0.0, params.bound_z / 2.0]);

    // let mut controls = three::controls::FirstPerson::builder(&camera)
    //     .position([0.0, 0.0, 25.0])
    //     .build();

    while window.update() {
        for (idx, member) in flock.members.lock().unwrap().iter().enumerate() {
            if !meshes.contains_key(&idx) {
                let geometry = three::Geometry::uv_sphere(0.2, 3, 3);
                let material = three::material::Basic {
                    color: 0x0000FF,
                    map: None,
                };

                let mesh = window.factory.mesh(geometry, material);
                window.scene.add(&mesh);
                meshes.insert(idx, mesh);
            }

            let mesh = meshes.get(&idx).unwrap();

            mesh.set_position([member.pos.x, member.pos.y, member.pos.z]);

            let color_scale = 4.0;

            let red = ((member.pos.x * color_scale + params.bound_x) / (params.bound_x * 2.0)
                * 255.0) as u32;
            let green = ((member.pos.y * color_scale + params.bound_y) / (params.bound_y * 2.0)
                * 255.0) as u32;
            let blue = ((member.pos.z * color_scale + params.bound_z) / (params.bound_z * 2.0)
                * 255.0) as u32;

            let color = red << 16 | green << 8 | blue;

            mesh.set_material(three::material::Basic { color, map: None })
        }

        flock.advance();

        // controls.update(&window.input);
        window.render(&camera);
    }
}
