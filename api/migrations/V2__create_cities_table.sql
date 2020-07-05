CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  locality VARCHAR NOT NULL,
  geom geometry(POINT,4326),
  place_id VARCHAR NOT NULL
);

CREATE INDEX cities_gist
  ON cities
  USING gist (geom);