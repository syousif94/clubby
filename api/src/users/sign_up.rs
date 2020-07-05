use crate::auth::{decode, encode};
use crate::db;
use crate::error::ApiError;
use crate::users::{ConfirmSignUpRequest, SignUpRequest, SignupClaims, User};

pub async fn validate_sign_up_request(req: &SignUpRequest) -> Result<(), ApiError> {
    let conn = db::connection().await?;
    let user_exists = User::phone_exists_in_db(&req.phone, &conn).await?;
    if user_exists {
        return Err(ApiError::new("Account exists".to_owned()));
    }
    Ok(())
}

pub fn encode_sign_up_request(req: &SignUpRequest) -> Result<String, ApiError> {
    let claims: SignupClaims = req.into();
    let token = encode(&claims)?;
    Ok(token)
}

pub fn decode_sign_up_request(req: &ConfirmSignUpRequest) -> Result<SignupClaims, ApiError> {
    let signup_token = decode::<SignupClaims>(&req.token)?;
    Ok(signup_token.claims)
}
