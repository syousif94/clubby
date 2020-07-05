use dotenv::dotenv;
use hyper::server::Server;
use listenfd::ListenFd;
use std::convert::Infallible;
use std::env;
use std::net::SocketAddr;
use warp::Filter;

mod auth;
mod cache;
mod cities;
mod db;
mod error;
mod places;
mod users;

#[tokio::main]
async fn main() {
    dotenv().ok();
    db::init().await;
    cache::init();
    places::init();
    auth::init();

    let routes = warp::path("api")
        .and(
            warp::path::end()
                .and(warp::get())
                .map(|| "Clubby Api says hi!")
                .or(cities::handler())
                .or(users::handler()),
        )
        .recover(error::handler);

    let svc = warp::service(routes);

    let make_svc = hyper::service::make_service_fn(|_: _| {
        let svc = svc.clone();
        async move { Ok::<_, Infallible>(svc) }
    });

    let mut listenfd = ListenFd::from_env();

    let server = match listenfd.take_tcp_listener(0).unwrap() {
        Some(listener) => Server::from_tcp(listener).unwrap(),
        None => {
            let host = env::var("HOST").expect("Please set host in .env");
            let port = env::var("PORT").expect("Please set port in .env");
            let addr: SocketAddr = format!("{}:{}", host, port).parse().unwrap();
            Server::bind(&addr)
        }
    };

    server.serve(make_svc).await.unwrap()
}
