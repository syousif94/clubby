use crate::cache;
use crate::error::ApiError;
use lazy_static::lazy_static;
use serde_json::Value;
use std::env;

lazy_static! {
    static ref DETAILS_URL: String = {
        let key = env::var("GOOGLE").expect("Google key not set");
        format!(
            "https://maps.googleapis.com/maps/api/place/details/json?key={}&place_id=",
            key
        )
    };
}

pub fn init() {
    lazy_static::initialize(&DETAILS_URL);
}

pub async fn get_place_json(id: &str) -> Result<Value, ApiError> {
    let url = format!("{}{}", DETAILS_URL.as_str(), id);
    let cache_key = format!("google_places:{}", id);
    cache::get_json(&cache_key, Some(&url), Some(24 * 60 * 60)).await
}
