-- 1. Enable PostGIS (MANDATORY for map features)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create the 'products' table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- GEOMETRY(Geometry, 4326) = Store any shape using GPS coordinates
    bounding_polygon GEOMETRY(Geometry, 4326) NOT NULL,
    
    consumption_link TEXT,
    type VARCHAR(50) NOT NULL,
    consumption_protocol VARCHAR(50) NOT NULL,
    
    resolution_best FLOAT,
    min_zoom INTEGER,
    max_zoom INTEGER
);

CREATE INDEX idx_products_geom ON products USING GIST (bounding_polygon);