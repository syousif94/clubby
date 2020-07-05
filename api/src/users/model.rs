use crate::auth;
use crate::cities::City;
use crate::db;
use crate::error::ApiError;
use crate::users::*;
use chrono::Utc;
use serde::{Deserialize, Serialize};
use tokio_postgres::Row;

#[derive(Deserialize)]
pub struct LoginCodeRequest {
    pub phone: String,
}

impl LoginCodeRequest {
    pub async fn validate(&self) -> Result<(), ApiError> {
        let conn = db::connection().await?;
        let exists = User::phone_exists_in_db(&self.phone, &conn).await?;
        if !exists {
            return Err(ApiError::new("Sign up required".to_owned()));
        }
        Ok(())
    }
}

#[derive(Deserialize)]
pub struct ConfirmCodeRequest {
    pub phone: String,
    pub code: String,
}

#[derive(Deserialize)]
pub struct SignUpRequest {
    pub name: String,
    pub phone: String,
    pub photo: Option<String>,
    pub city: String,
}

impl SignUpRequest {
    pub async fn validate(&self) -> Result<(), ApiError> {
        validate_sign_up_request(self).await
    }
}

pub struct User {
    pub id: i64,
    pub name: String,
    pub phone: String,
    pub photo: Option<String>,
    pub city_id: i32,
}

impl User {
    pub fn token(&self) -> Result<String, ApiError> {
        let claims: UserClaims = self.into();
        let token = auth::encode(&claims)?;
        Ok(token)
    }

    pub async fn phone_exists_in_db(phone: &str, conn: &db::DbConn) -> Result<bool, ApiError> {
        let query = "SELECT EXISTS(SELECT 1 FROM users WHERE phone=$1)";
        let row = conn.query_one(query, &[&phone]).await?;
        let user_exists: bool = row.get(0);
        Ok(user_exists)
    }

    pub async fn from_phone(phone: &str) -> Result<User, ApiError> {
        let conn = db::connection().await?;
        let query = "SELECT * FROM users WHERE phone=$1 LIMIT 1";
        let row = conn.query_one(query, &[&phone]).await?;
        Ok(User::from(&row))
    }
}

impl From<&Row> for User {
    fn from(row: &Row) -> Self {
        User {
            id: row.get("id"),
            name: row.get("name"),
            phone: row.get("phone"),
            photo: row.get("photo"),
            city_id: row.get("city_id"),
        }
    }
}

#[derive(Serialize)]
pub struct UserData {
    pub name: String,
    pub phone: String,
    pub photo: Option<String>,
    pub city_id: i32,
}

impl UserData {
    pub async fn create(&self) -> Result<User, ApiError> {
        let conn = db::connection().await?;
        let query = "INSERT INTO users VALUES (DEFAULT, $1, $2, $3, DEFAULT, $4) RETURNING *";
        let row = conn
            .query_one(
                query,
                &[&self.name, &self.phone, &self.photo, &self.city_id],
            )
            .await?;
        Ok(User::from(&row))
    }
}

impl From<User> for UserData {
    fn from(user: User) -> Self {
        UserData {
            name: user.name,
            phone: user.phone,
            photo: user.photo,
            city_id: user.city_id,
        }
    }
}

#[derive(Serialize)]
pub struct SignUpResponse {
    pub token: String,
}

#[derive(Deserialize)]
pub struct ConfirmSignUpRequest {
    pub token: String,
    pub code: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub user: UserData,
    pub token: String,
    pub city: City,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SignupClaims {
    pub name: String,
    pub phone: String,
    pub photo: Option<String>,
    pub city: String,
    exp: usize,
}

impl From<&SignUpRequest> for SignupClaims {
    fn from(user: &SignUpRequest) -> Self {
        let exp = Utc::now().timestamp() + 60 * 10;
        SignupClaims {
            name: user.name.to_owned(),
            phone: user.phone.to_owned(),
            photo: user.photo.to_owned(),
            city: user.city.to_owned(),
            exp: exp as usize,
        }
    }
}
#[derive(Debug, Serialize, Deserialize)]
pub struct UserClaims {
    pub id: i64,
}

impl From<&User> for UserClaims {
    fn from(user: &User) -> Self {
        UserClaims { id: user.id }
    }
}
