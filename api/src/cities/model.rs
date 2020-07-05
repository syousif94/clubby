use crate::db;
use crate::error::ApiError;
use crate::places::get_place_json;
use mobc_postgres::tokio_postgres;
use postgis::ewkb;
use serde::{Deserialize, Serialize};
use tokio_postgres::{Error, Row};

#[derive(Deserialize)]
pub struct SuggestCityRequest {
    pub text: String,
}

#[derive(Serialize)]
pub struct CitySuggestions {
    pub suggestions: Vec<CitySuggestion>,
}

#[derive(Serialize)]
pub struct CitySuggestion {
    pub main_text: String,
    pub secondary_text: String,
    pub place_id: String,
}
#[derive(Serialize)]
pub struct City {
    pub id: i32,
    pub name: String,
    pub locality: String,
    pub lat: f64,
    pub lng: f64,
    pub place_id: String,
}

struct NewCity {
    pub name: String,
    pub locality: String,
    pub lat: f64,
    pub lng: f64,
    pub place_id: String,
}

fn address_component_is(types: &Vec<serde_json::Value>, component_type: &str) -> bool {
    types
        .into_iter()
        .find(|val| match val.as_str() {
            Some(val) => val.eq(component_type),
            None => false,
        })
        .is_some()
}

impl NewCity {
    fn from_place_json(id: &str, json: &serde_json::Value) -> Option<Self> {
        let mut name: Option<&str> = None;
        let mut locality: Option<&str> = None;
        for component in json["result"]["address_components"].as_array()?.into_iter() {
            let types = component["types"].as_array()?;
            if address_component_is(types, "locality") {
                name = component["long_name"].as_str();
            } else if address_component_is(types, "country")
                && component["short_name"].as_str()?.ne("US")
            {
                locality = component["long_name"].as_str();
            } else if address_component_is(types, "administrative_area_level_1") {
                locality = component["long_name"].as_str();
            }
        }
        let lat = json["result"]["geometry"]["location"]["lat"].as_f64()?;
        let lng = json["result"]["geometry"]["location"]["lng"].as_f64()?;
        let city = NewCity {
            name: name?.to_owned(),
            locality: locality?.to_owned(),
            lat,
            lng,
            place_id: id.to_owned(),
        };
        Some(city)
    }

    async fn save(&self, conn: &db::DbConn) -> Result<City, ApiError> {
        let query =
            "INSERT INTO cities VALUES (DEFAULT, $1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5) RETURNING *";
        let row: Row = conn
            .query_one(
                query,
                &[
                    &self.name,
                    &self.locality,
                    &self.lng,
                    &self.lat,
                    &self.place_id,
                ],
            )
            .await?;
        Ok(City::from(&row))
    }
}

impl City {
    pub async fn from_place_id(id: &str) -> Result<City, ApiError> {
        let query = "SELECT * FROM cities WHERE place_id=$1 LIMIT 1";
        let conn = db::connection().await?;
        let row_result: Result<Row, Error> = conn.query_one(query, &[&id.to_owned()]).await;
        let city: City;
        match row_result {
            Ok(row) => city = City::from(&row),
            Err(_e) => {
                let json = get_place_json(id).await?;
                let new_city = NewCity::from_place_json(id, &json);
                match new_city {
                    Some(new_city) => {
                        city = new_city.save(&conn).await?;
                    }
                    None => return Err(ApiError::new("Failed to save city".to_owned())),
                };
            }
        };
        Ok(city)
    }

    pub async fn from_id(id: &i32) -> Result<City, ApiError> {
        let query = "SELECT * FROM cities WHERE id=$1 LIMIT 1";
        let conn = db::connection().await?;
        let row = conn.query_one(query, &[&id]).await?;
        Ok(City::from(&row))
    }
}

impl From<&Row> for City {
    fn from(row: &Row) -> Self {
        let point: ewkb::Point = row.get("geom");
        City {
            id: row.get("id"),
            name: row.get("name"),
            locality: row.get("locality"),
            lat: point.y,
            lng: point.x,
            place_id: row.get("place_id"),
        }
    }
}
