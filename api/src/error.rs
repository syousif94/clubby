use mobc_redis::redis::RedisError;
use serde::{Deserialize, Serialize};
use std::convert::Infallible;
use std::fmt;
use warp::{Rejection, Reply};

#[derive(Debug, Deserialize, Serialize)]
pub struct ApiError {
    pub error: String,
}

impl ApiError {
    pub fn new(error: String) -> ApiError {
        ApiError { error }
    }
}

impl From<RedisError> for ApiError {
    fn from(error: RedisError) -> Self {
        ApiError::new(format!("Cache error: {}", error))
    }
}

impl From<serde_json::Error> for ApiError {
    fn from(error: serde_json::Error) -> Self {
        ApiError::new(format!("Json parsing error: {}", error))
    }
}

impl From<reqwest::Error> for ApiError {
    fn from(error: reqwest::Error) -> Self {
        ApiError::new(format!("Http request error: {}", error))
    }
}

impl From<mobc_postgres::tokio_postgres::Error> for ApiError {
    fn from(error: mobc_postgres::tokio_postgres::Error) -> Self {
        ApiError::new(format!("Database error: {}", error))
    }
}

impl From<jsonwebtoken::errors::Error> for ApiError {
    fn from(error: jsonwebtoken::errors::Error) -> Self {
        ApiError::new(format!("Token error: {}", error))
    }
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.write_str(&self.error)
    }
}

impl warp::reject::Reject for ApiError {}

impl From<ApiError> for warp::Rejection {
    fn from(e: ApiError) -> Self {
        warp::reject::custom(e)
    }
}

pub async fn handler(err: Rejection) -> Result<impl Reply, Infallible> {
    if let Some(err) = err.find::<ApiError>() {
        return Ok(warp::reply::json(&err));
    } else {
        let error = ApiError::new(format!("Server error: {:?}", err));
        return Ok(warp::reply::json(&error));
    }
}
