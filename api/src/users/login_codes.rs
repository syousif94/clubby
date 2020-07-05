extern crate rand;
extern crate rusoto_core;
extern crate rusoto_sns;
use crate::cache;
use crate::error::ApiError;
use mobc_redis::{redis, Connection};
use rand::{thread_rng, Rng};
use rusoto_core::{HttpClient, Region};
use rusoto_credential::EnvironmentProvider;
use rusoto_sns::{PublishInput, Sns, SnsClient};

fn generate_login_code() -> String {
    let mut rng = thread_rng();
    let code: u16 = rng.gen_range(1000, 9999);
    code.to_string()
}

async fn persist_login_code(number: &str, code: &str) -> Result<(), ApiError> {
    let mut conn = cache::connection().await?;
    let key = format!("login_code:{}", number);
    let result = redis::cmd("SET")
        .arg(key)
        .arg(code)
        .arg("EX")
        .arg(5 * 60)
        .query_async::<_, String>(&mut conn as &mut Connection)
        .await;
    match result {
        Ok(text) => {
            if text.eq("OK") {
                Ok(())
            } else {
                Err(ApiError::new(format!("Cache error: {}", text)))
            }
        }
        Err(error) => Err(ApiError::from(error)),
    }
}

pub async fn send_login_code(number: &str) -> Result<(), ApiError> {
    let credentials = EnvironmentProvider::default();
    let client = SnsClient::new_with(HttpClient::new().unwrap(), credentials, Region::UsWest2);
    let code = generate_login_code();
    persist_login_code(number, &code).await?;
    let message = format!("Your Clubby login code is {}", code);
    let phone_number = format!("+1{}", number);
    let input = PublishInput {
        message: message,
        message_structure: Some("string".to_owned()),
        phone_number: Some(phone_number),
        message_attributes: None,
        subject: None,
        target_arn: None,
        topic_arn: None,
    };
    let result = client.publish(input).await;
    match result {
        Ok(_response) => Ok(()),
        Err(error) => Err(ApiError::new(format!("Login code error: {}", error))),
    }
}

pub async fn validate_login_code(number: &str, code: &str) -> Result<(), ApiError> {
    let mut conn = cache::connection().await?;
    let key = format!("login_code:{}", number);
    let result = redis::cmd("GET")
        .arg(key)
        .query_async::<_, String>(&mut conn as &mut Connection)
        .await?;

    if result.eq(code) {
        Ok(())
    } else {
        Err(ApiError::new("Invalid login code, please retry".to_owned()))
    }
}
