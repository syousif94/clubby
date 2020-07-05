use crate::error::ApiError;
use lazy_static::lazy_static;
use mobc::{Connection, Pool};
use mobc_redis::{redis, RedisConnectionManager};
use serde_json::Value;
use std::env;

type CachePool = Pool<RedisConnectionManager>;

lazy_static! {
    static ref POOL: CachePool = {
        let url = env::var("REDIS_URL").expect("Cache url not set");
        let client = redis::Client::open(url).unwrap();
        let manager = RedisConnectionManager::new(client);
        Pool::builder().build(manager)
    };
}

pub fn init() {
    lazy_static::initialize(&POOL);
}

pub async fn connection() -> Result<Connection<RedisConnectionManager>, ApiError> {
    POOL.get()
        .await
        .map_err(|e| ApiError::new(format!("Cache Error: {}", e)))
}

pub async fn get_json(
    cache_key: &str,
    url: Option<&str>,
    expiration: Option<i32>,
) -> Result<Value, ApiError> {
    let mut conn = connection().await?;
    let cache_result = redis::cmd("GET")
        .arg(cache_key)
        .query_async::<_, String>(&mut conn as &mut mobc_redis::Connection)
        .await;
    if cache_result.is_ok() {
        let json: Value = serde_json::from_str(&cache_result.unwrap())?;
        return Ok(json);
    } else if url.is_none() {
        return Err(cache_result.err().unwrap().into());
    }
    let http_result = reqwest::get(url.unwrap()).await?.text().await?;
    let mut cmd = redis::cmd("SET");
    let mut redis_set = cmd.arg(cache_key).arg(&http_result);
    if let Some(expiration) = expiration {
        redis_set = redis_set.arg("EX").arg(expiration);
    }

    redis_set
        .query_async::<_, String>(&mut conn as &mut mobc_redis::Connection)
        .await?;
    let json: Value = serde_json::from_str(&http_result)?;
    Ok(json)
}
