use crate::cities::City;
use crate::users::*;
use serde_json::json;
use warp::{Filter, Rejection, Reply};

async fn sign_up(req: SignUpRequest) -> Result<impl Reply, Rejection> {
    req.validate().await?;
    let token = encode_sign_up_request(&req)?;
    send_login_code(&req.phone).await?;
    let res = SignUpResponse { token };
    Ok(warp::reply::json(&res))
}

async fn complete_sign_up(req: ConfirmSignUpRequest) -> Result<impl Reply, Rejection> {
    let signup_claims = decode_sign_up_request(&req)?;
    let city = City::from_place_id(&signup_claims.city).await?;
    let user_data = UserData {
        name: signup_claims.name,
        phone: signup_claims.phone,
        photo: signup_claims.photo,
        city_id: city.id,
    };
    let user = user_data.create().await?;
    let token = user.token()?;
    let res = LoginResponse {
        user: user_data,
        city,
        token,
    };
    Ok(warp::reply::json(&res))
}

async fn login(req: LoginCodeRequest) -> Result<impl Reply, Rejection> {
    req.validate().await?;
    send_login_code(&req.phone).await?;
    Ok(warp::reply::json(&json!({})))
}

async fn complete_login(req: ConfirmCodeRequest) -> Result<impl Reply, Rejection> {
    validate_login_code(&req.phone, &req.code).await?;
    let user = User::from_phone(&req.phone).await?;
    let token = user.token()?;
    let city = City::from_id(&user.city_id).await?;
    let res = LoginResponse {
        user: user.into(),
        city,
        token: token.clone(),
    };
    let reply = warp::reply::json(&res);
    let cookie_header = "set-cookie";
    let cookie_value = format!(
        "token={}; Max-Age=31556952; Secure; HttpOnly; Path=/",
        &token
    );
    let reply_with_header = warp::reply::with_header(reply, cookie_header, cookie_value);
    Ok(reply_with_header)
}

pub fn handler() -> warp::filters::BoxedFilter<(impl Reply,)> {
    let cities = warp::path("users");

    let sign_up_route = warp::path("signup")
        .and(warp::post())
        .and(warp::path::end())
        .and(warp::body::json())
        .and_then(sign_up);

    let confirm_sign_up_route = warp::path("signup")
        .and(warp::path("complete"))
        .and(warp::post())
        .and(warp::path::end())
        .and(warp::body::json())
        .and_then(complete_sign_up);

    let login_route = warp::path("login")
        .and(warp::post())
        .and(warp::path::end())
        .and(warp::body::json())
        .and_then(login);

    let confirm_login_route = warp::path("login")
        .and(warp::path("complete"))
        .and(warp::post())
        .and(warp::path::end())
        .and(warp::body::json())
        .and_then(complete_login);

    cities
        .and(
            sign_up_route
                .or(confirm_sign_up_route)
                .or(login_route)
                .or(confirm_login_route),
        )
        .boxed()
}
