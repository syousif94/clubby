use crate::error::ApiError;
use lazy_static::lazy_static;
use mobc::{Connection, Pool};
use mobc_postgres::PgConnectionManager;
use std::env;
use std::ops::DerefMut;
use std::str::FromStr;
use tokio_postgres::{Config, NoTls};
mod embedded {
    use refinery::embed_migrations;
    embed_migrations!("migrations");
}

type DbPool = Pool<PgConnectionManager<NoTls>>;

pub type DbConn = Connection<PgConnectionManager<NoTls>>;

lazy_static! {
    static ref POOL: DbPool = {
        let db_url = env::var("DATABASE_URL").expect("Database url not set");
        let config = Config::from_str(&db_url).unwrap();
        let manager = PgConnectionManager::new(config, NoTls);
        Pool::builder().build(manager)
    };
}

pub async fn init() {
    lazy_static::initialize(&POOL);
    let mut conn = connection().await.unwrap();
    let client = conn.deref_mut();
    let _migration_report = embedded::migrations::runner().run_async(client).await;
}

pub async fn connection() -> Result<DbConn, ApiError> {
    POOL.get()
        .await
        .map_err(|e| ApiError::new(format!("Database Error: {}", e)))
}
