use jsonwebtoken::{DecodingKey, EncodingKey, Header, TokenData, Validation};
use lazy_static::lazy_static;
use serde::Serialize;
use std::env;

lazy_static! {
    static ref JWT_ENCODING_KEY: EncodingKey = {
        let secret = env::var("JWT").expect("JWT key not set");
        EncodingKey::from_secret(secret.as_bytes())
    };
    static ref JWT_DECODING_KEY: DecodingKey<'static> = {
        let secret = env::var("JWT").expect("JWT key not set");
        let bytes = secret.as_bytes();
        DecodingKey::from_secret(bytes).into_static()
    };
}

pub fn init() {
    lazy_static::initialize(&JWT_ENCODING_KEY);
    lazy_static::initialize(&JWT_DECODING_KEY);
}

pub fn encode<T: Serialize>(claims: &T) -> Result<String, jsonwebtoken::errors::Error> {
    jsonwebtoken::encode(&Header::default(), claims, &JWT_ENCODING_KEY)
}

pub fn decode<T: serde::de::DeserializeOwned>(
    token: &str,
) -> Result<TokenData<T>, jsonwebtoken::errors::Error> {
    let validation = Validation::default();
    jsonwebtoken::decode::<T>(token, &JWT_DECODING_KEY, &validation)
}

// pub fn extract_token(req: HttpRequest) -> Option<String> {
//   let authorization = req.headers().get(actix_web::http::header::AUTHORIZATION)?;
//   Some(String::from(authorization.to_str().unwrap()))
// }
