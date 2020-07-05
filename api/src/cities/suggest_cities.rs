use crate::cache;
use crate::cities::{CitySuggestion, CitySuggestions};
use crate::error::ApiError;
use lazy_static::lazy_static;
use percent_encoding::{utf8_percent_encode, NON_ALPHANUMERIC};
use serde_json::Value;
use std::env;

lazy_static! {
    static ref AUTOCOMPLETE_URL: String = {
        let key = env::var("GOOGLE").expect("Google key not set");
        format!(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json?key={}&types=(cities)&input=",
      key
    )
    };
}

pub fn init_suggestions() {
    lazy_static::initialize(&AUTOCOMPLETE_URL);
}

async fn get_suggestions_json(text: &str) -> Result<Value, ApiError> {
    let cache_key = format!("google_cities:{}", text);
    let encoded_text = utf8_percent_encode(text, NON_ALPHANUMERIC);
    let url = format!("{}{}", AUTOCOMPLETE_URL.as_str(), encoded_text);
    cache::get_json(&cache_key, Some(&url), Some(24 * 60 * 60)).await
}

pub async fn get_suggestions(text: &str) -> Result<CitySuggestions, ApiError> {
    let json = get_suggestions_json(text).await?;
    let predictions_json = json["predictions"].as_array().unwrap();
    Ok(CitySuggestions {
        suggestions: predictions_json
            .iter()
            .map(|prediction| CitySuggestion {
                main_text: prediction["structured_formatting"]["main_text"]
                    .as_str()
                    .unwrap()
                    .to_owned(),
                secondary_text: prediction["structured_formatting"]["secondary_text"]
                    .as_str()
                    .unwrap()
                    .to_owned(),
                place_id: prediction["place_id"].as_str().unwrap().to_owned(),
            })
            .collect(),
    })
}
