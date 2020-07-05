use crate::cities::{get_suggestions, init_suggestions, SuggestCityRequest};
use warp::{Filter, Rejection, Reply};

async fn suggest_cities(request: SuggestCityRequest) -> Result<impl Reply, Rejection> {
    let json = get_suggestions(&request.text).await?;
    Ok(warp::reply::json(&json))
}

pub fn handler() -> warp::filters::BoxedFilter<(impl Reply,)> {
    init_suggestions();

    let cities = warp::path("cities");

    let suggest_cities_route = warp::path("suggest")
        .and(warp::post())
        .and(warp::path::end())
        .and(warp::body::json())
        .and_then(suggest_cities);

    cities.and(suggest_cities_route).boxed()
}
