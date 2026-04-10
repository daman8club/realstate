-- ============================================================
-- Shine Native Real Estate Platform
-- CockroachDB Serverless Compatible Schema (v4)
-- Run this directly against your CockroachDB database.
-- Do NOT include CREATE DATABASE or USE statements.
-- ============================================================

-- ─── TABLES ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  phone         VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  profile_image VARCHAR(500),
  address       TEXT,
  role          STRING NOT NULL DEFAULT 'user'
                CHECK (role IN ('user','admin','agent')),
  created_at    TIMESTAMP DEFAULT current_timestamp(),
  updated_at    TIMESTAMP DEFAULT current_timestamp()
);

CREATE TABLE IF NOT EXISTS agents (
  id               SERIAL PRIMARY KEY,
  user_id          INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialization   VARCHAR(100),
  experience_years INT,
  properties_sold  INT DEFAULT 0,
  rating           DECIMAL(3,2),
  bio              TEXT,
  whatsapp         VARCHAR(20),
  is_active        BOOL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS properties (
  id               SERIAL PRIMARY KEY,
  title            VARCHAR(255) NOT NULL,
  description      TEXT,
  property_type    STRING NOT NULL
                   CHECK (property_type IN ('apartment','villa','townhouse','commercial','land')),
  bhk              INT,
  price            BIGINT NOT NULL,
  price_currency   VARCHAR(10) DEFAULT 'INR',
  location         VARCHAR(255) NOT NULL,
  city             VARCHAR(100) NOT NULL,
  state            VARCHAR(100),
  postal_code      VARCHAR(20),
  latitude         DECIMAL(10,8),
  longitude        DECIMAL(11,8),
  area_sqft        INT,
  build_year       INT,
  agent_id         INT REFERENCES agents(id) ON DELETE SET NULL,
  status           STRING NOT NULL DEFAULT 'available'
                   CHECK (status IN ('available','sold','under_offer','pending')),
  featured         BOOL DEFAULT FALSE,
  virtual_tour_url VARCHAR(500),
  created_at       TIMESTAMP DEFAULT current_timestamp(),
  updated_at       TIMESTAMP DEFAULT current_timestamp()
);

CREATE INDEX IF NOT EXISTS idx_prop_city     ON properties(city);
CREATE INDEX IF NOT EXISTS idx_prop_status   ON properties(status);
CREATE INDEX IF NOT EXISTS idx_prop_price    ON properties(price);
CREATE INDEX IF NOT EXISTS idx_prop_type     ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_prop_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_prop_city_st  ON properties(city, status);

CREATE TABLE IF NOT EXISTS property_images (
  id            SERIAL PRIMARY KEY,
  property_id   INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url     VARCHAR(500) NOT NULL,
  image_title   VARCHAR(255),
  display_order INT DEFAULT 1,
  created_at    TIMESTAMP DEFAULT current_timestamp()
);
CREATE INDEX IF NOT EXISTS idx_pimg_prop ON property_images(property_id);

CREATE TABLE IF NOT EXISTS amenities (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR(100) UNIQUE NOT NULL,
  icon     VARCHAR(255),
  category VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS property_amenities (
  id          SERIAL PRIMARY KEY,
  property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id  INT NOT NULL REFERENCES amenities(id)  ON DELETE CASCADE,
  UNIQUE (property_id, amenity_id)
);

CREATE TABLE IF NOT EXISTS inquiries (
  id           SERIAL PRIMARY KEY,
  property_id  INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id      INT REFERENCES users(id) ON DELETE SET NULL,
  name         VARCHAR(255),
  email        VARCHAR(255),
  phone        VARCHAR(20),
  message      TEXT,
  inquiry_type STRING NOT NULL DEFAULT 'general'
               CHECK (inquiry_type IN ('call_back','schedule_visit','general','emi_query')),
  status       STRING NOT NULL DEFAULT 'new'
               CHECK (status IN ('new','contacted','scheduled','closed')),
  created_at   TIMESTAMP DEFAULT current_timestamp(),
  responded_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_inq_prop    ON inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_inq_status  ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inq_created ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_inq_ps      ON inquiries(property_id, status);

CREATE TABLE IF NOT EXISTS scheduled_visits (
  id            SERIAL PRIMARY KEY,
  property_id   INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id       INT REFERENCES users(id) ON DELETE SET NULL,
  visitor_name  VARCHAR(255),
  visitor_email VARCHAR(255),
  visitor_phone VARCHAR(20),
  visit_date    DATE NOT NULL,
  visit_time    TIME NOT NULL,
  status        STRING NOT NULL DEFAULT 'scheduled'
                CHECK (status IN ('scheduled','completed','cancelled','no_show')),
  notes         TEXT,
  created_at    TIMESTAMP DEFAULT current_timestamp()
);
CREATE INDEX IF NOT EXISTS idx_sv_prop ON scheduled_visits(property_id);
CREATE INDEX IF NOT EXISTS idx_sv_date ON scheduled_visits(visit_date);

CREATE TABLE IF NOT EXISTS neighborhood_insights (
  id                 SERIAL PRIMARY KEY,
  location_name      VARCHAR(255),
  latitude           DECIMAL(10,8),
  longitude          DECIMAL(11,8),
  schools_rating     DECIMAL(3,2),
  hospitals_rating   DECIMAL(3,2),
  metro_rating       DECIMAL(3,2),
  shopping_rating    DECIMAL(3,2),
  restaurants_rating DECIMAL(3,2),
  safety_rating      DECIMAL(3,2),
  description        TEXT,
  updated_at         TIMESTAMP DEFAULT current_timestamp()
);

CREATE TABLE IF NOT EXISTS emi_calculations (
  id               SERIAL PRIMARY KEY,
  user_id          INT,
  property_id      INT REFERENCES properties(id) ON DELETE SET NULL,
  principal_amount BIGINT,
  rate_of_interest DECIMAL(5,2),
  tenure_years     INT,
  monthly_emi      BIGINT,
  total_amount     BIGINT,
  total_interest   BIGINT,
  created_at       TIMESTAMP DEFAULT current_timestamp()
);

CREATE TABLE IF NOT EXISTS admin_settings (
  id            SERIAL PRIMARY KEY,
  setting_key   VARCHAR(100) UNIQUE NOT NULL,
  setting_value VARCHAR(500),
  updated_at    TIMESTAMP DEFAULT current_timestamp()
);

CREATE TABLE IF NOT EXISTS property_price_history (
  id          SERIAL PRIMARY KEY,
  property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  old_price   BIGINT,
  new_price   BIGINT,
  changed_at  TIMESTAMP DEFAULT current_timestamp()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_agents_user ON agents(user_id);

-- ─── SEED DATA ────────────────────────────────────────────────

-- 1. Amenities
INSERT INTO amenities (name, icon, category) VALUES
  ('Gym',           'dumbbell',    'fitness'),
  ('Swimming Pool', 'waves',       'recreation'),
  ('24/7 Security', 'shield',      'security'),
  ('Parking',       'car',         'facility'),
  ('Garden',        'leaf',        'outdoor'),
  ('Clubhouse',     'home',        'community'),
  ('Lift',          'arrow-up',    'facility'),
  ('Central AC',    'wind',        'utility'),
  ('Water Supply',  'droplet',     'utility'),
  ('Power Backup',  'battery',     'utility'),
  ('Gate',          'lock',        'security'),
  ('Playground',    'play-circle', 'recreation')
ON CONFLICT (name) DO NOTHING;

-- 2. Users (admin + 2 agents)
INSERT INTO users (name, email, phone, password_hash, role) VALUES
  ('Admin User',   'admin@shinenative.com',  '+911234567890',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
  ('Rajesh Kumar', 'rajesh@shinenative.com', '+919876543210',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'agent'),
  ('Priya Sharma', 'priya@shinenative.com',  '+919876543211',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'agent')
ON CONFLICT (email) DO NOTHING;

-- 3. Agents — user_id resolved by email
INSERT INTO agents (user_id, specialization, experience_years, properties_sold, rating, bio, whatsapp)
SELECT u.id, 'Luxury Residential', 8, 45, 4.8,
  'Specialist in luxury residential properties across Bangalore with 8 years of experience.',
  '919876543210'
FROM users u WHERE u.email = 'rajesh@shinenative.com'
ON CONFLICT DO NOTHING;

INSERT INTO agents (user_id, specialization, experience_years, properties_sold, rating, bio, whatsapp)
SELECT u.id, 'Commercial & Residential', 5, 28, 4.6,
  'Expert in both commercial and residential properties in Mumbai and Pune.',
  '919876543211'
FROM users u WHERE u.email = 'priya@shinenative.com'
ON CONFLICT DO NOTHING;

-- 4. Properties — agent_id resolved by email via subquery
INSERT INTO properties (title, description, property_type, bhk, price, location, city, state, postal_code, latitude, longitude, area_sqft, build_year, agent_id, status, featured)
VALUES (
  'Luxury 3BHK Apartment in Koramangala',
  'A stunning 3BHK apartment in the heart of Koramangala with premium finishes, modular kitchen, and breathtaking city views.',
  'apartment', 3, 12500000, 'Koramangala 5th Block', 'Bangalore', 'Karnataka',
  '560095', 12.93490000, 77.62640000, 1850, 2021,
  (SELECT a.id FROM agents a JOIN users u ON a.user_id = u.id WHERE u.email = 'rajesh@shinenative.com' LIMIT 1),
  'available', TRUE
) ON CONFLICT DO NOTHING;

INSERT INTO properties (title, description, property_type, bhk, price, location, city, state, postal_code, latitude, longitude, area_sqft, build_year, agent_id, status, featured)
VALUES (
  'Premium Villa with Pool in Whitefield',
  'An exquisite 4BHK villa with a private swimming pool, landscaped garden, and smart home automation.',
  'villa', 4, 35000000, 'Whitefield Main Road', 'Bangalore', 'Karnataka',
  '560066', 12.96960000, 77.75010000, 4200, 2020,
  (SELECT a.id FROM agents a JOIN users u ON a.user_id = u.id WHERE u.email = 'rajesh@shinenative.com' LIMIT 1),
  'available', TRUE
) ON CONFLICT DO NOTHING;

INSERT INTO properties (title, description, property_type, bhk, price, location, city, state, postal_code, latitude, longitude, area_sqft, build_year, agent_id, status, featured)
VALUES (
  'Modern 2BHK in Bandra West',
  'Contemporary 2BHK apartment in the most sought-after locality of Mumbai.',
  'apartment', 2, 18500000, 'Bandra West', 'Mumbai', 'Maharashtra',
  '400050', 19.05960000, 72.83620000, 1100, 2022,
  (SELECT a.id FROM agents a JOIN users u ON a.user_id = u.id WHERE u.email = 'priya@shinenative.com' LIMIT 1),
  'available', TRUE
) ON CONFLICT DO NOTHING;

INSERT INTO properties (title, description, property_type, bhk, price, location, city, state, postal_code, latitude, longitude, area_sqft, build_year, agent_id, status, featured)
VALUES (
  'Spacious 3BHK in Hitech City',
  'Well-designed 3BHK apartment near Hitech City IT hub. Perfect for IT professionals.',
  'apartment', 3, 9800000, 'Hitech City', 'Hyderabad', 'Telangana',
  '500081', 17.44740000, 78.37420000, 1650, 2021,
  (SELECT a.id FROM agents a JOIN users u ON a.user_id = u.id WHERE u.email = 'priya@shinenative.com' LIMIT 1),
  'available', FALSE
) ON CONFLICT DO NOTHING;

INSERT INTO properties (title, description, property_type, bhk, price, location, city, state, postal_code, latitude, longitude, area_sqft, build_year, agent_id, status, featured)
VALUES (
  'Independent Villa in Jubilee Hills',
  'Elegant 5BHK independent villa in the prestigious Jubilee Hills locality.',
  'villa', 5, 65000000, 'Jubilee Hills Road No. 36', 'Hyderabad', 'Telangana',
  '500033', 17.43180000, 78.40720000, 5500, 2019,
  (SELECT a.id FROM agents a JOIN users u ON a.user_id = u.id WHERE u.email = 'rajesh@shinenative.com' LIMIT 1),
  'available', TRUE
) ON CONFLICT DO NOTHING;

INSERT INTO properties (title, description, property_type, bhk, price, location, city, state, postal_code, latitude, longitude, area_sqft, build_year, agent_id, status, featured)
VALUES (
  'Affordable 1BHK in Pune',
  'Compact and well-designed 1BHK apartment in Wakad, Pune. Close to Hinjewadi IT Park.',
  'apartment', 1, 4500000, 'Wakad', 'Pune', 'Maharashtra',
  '411057', 18.59870000, 73.76140000, 650, 2022,
  (SELECT a.id FROM agents a JOIN users u ON a.user_id = u.id WHERE u.email = 'priya@shinenative.com' LIMIT 1),
  'available', FALSE
) ON CONFLICT DO NOTHING;

INSERT INTO properties (title, description, property_type, bhk, price, location, city, state, postal_code, latitude, longitude, area_sqft, build_year, agent_id, status, featured)
VALUES (
  'Commercial Office Space in MG Road',
  'Premium commercial office space on MG Road with modern infrastructure and ample parking.',
  'commercial', NULL, 25000000, 'MG Road', 'Bangalore', 'Karnataka',
  '560001', 12.97560000, 77.60990000, 3000, 2020,
  (SELECT a.id FROM agents a JOIN users u ON a.user_id = u.id WHERE u.email = 'rajesh@shinenative.com' LIMIT 1),
  'available', FALSE
) ON CONFLICT DO NOTHING;

INSERT INTO properties (title, description, property_type, bhk, price, location, city, state, postal_code, latitude, longitude, area_sqft, build_year, agent_id, status, featured)
VALUES (
  'Luxury Penthouse in South Mumbai',
  'Ultra-luxury 4BHK penthouse with panoramic sea views and world-class amenities.',
  'apartment', 4, 95000000, 'Worli Sea Face', 'Mumbai', 'Maharashtra',
  '400018', 19.01760000, 72.81620000, 6000, 2021,
  (SELECT a.id FROM agents a JOIN users u ON a.user_id = u.id WHERE u.email = 'priya@shinenative.com' LIMIT 1),
  'available', TRUE
) ON CONFLICT DO NOTHING;

INSERT INTO properties (title, description, property_type, bhk, price, location, city, state, postal_code, latitude, longitude, area_sqft, build_year, agent_id, status, featured)
VALUES (
  '3BHK Townhouse in Sarjapur',
  'Beautiful 3BHK townhouse in a premium gated community with private garden.',
  'townhouse', 3, 8500000, 'Sarjapur Road', 'Bangalore', 'Karnataka',
  '560035', 12.85560000, 77.69870000, 2100, 2022,
  (SELECT a.id FROM agents a JOIN users u ON a.user_id = u.id WHERE u.email = 'rajesh@shinenative.com' LIMIT 1),
  'available', FALSE
) ON CONFLICT DO NOTHING;

INSERT INTO properties (title, description, property_type, bhk, price, location, city, state, postal_code, latitude, longitude, area_sqft, build_year, agent_id, status, featured)
VALUES (
  'Plot in Devanahalli',
  'Prime residential plot near Kempegowda International Airport.',
  'land', NULL, 6500000, 'Devanahalli', 'Bangalore', 'Karnataka',
  '562110', 13.24870000, 77.71230000, 2400, NULL,
  (SELECT a.id FROM agents a JOIN users u ON a.user_id = u.id WHERE u.email = 'rajesh@shinenative.com' LIMIT 1),
  'available', FALSE
) ON CONFLICT DO NOTHING;

-- 5. Property Images — resolved by property title
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', 1 FROM properties WHERE title = 'Luxury 3BHK Apartment in Koramangala';
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', 2 FROM properties WHERE title = 'Luxury 3BHK Apartment in Koramangala';
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', 3 FROM properties WHERE title = 'Luxury 3BHK Apartment in Koramangala';
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', 1 FROM properties WHERE title = 'Premium Villa with Pool in Whitefield';
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', 2 FROM properties WHERE title = 'Premium Villa with Pool in Whitefield';
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 1 FROM properties WHERE title = 'Modern 2BHK in Bandra West';
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', 2 FROM properties WHERE title = 'Modern 2BHK in Bandra West';
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', 1 FROM properties WHERE title = 'Spacious 3BHK in Hitech City';
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80', 1 FROM properties WHERE title = 'Independent Villa in Jubilee Hills';
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', 2 FROM properties WHERE title = 'Independent Villa in Jubilee Hills';
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 1 FROM properties WHERE title = 'Affordable 1BHK in Pune';
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 1 FROM properties WHERE title = 'Commercial Office Space in MG Road';
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', 1 FROM properties WHERE title = 'Luxury Penthouse in South Mumbai';
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 2 FROM properties WHERE title = 'Luxury Penthouse in South Mumbai';
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80', 1 FROM properties WHERE title = '3BHK Townhouse in Sarjapur';
INSERT INTO property_images (property_id, image_url, display_order) SELECT id, 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', 1 FROM properties WHERE title = 'Plot in Devanahalli';

-- 6. Property Amenities — resolved by title and amenity name
INSERT INTO property_amenities (property_id, amenity_id)
SELECT p.id, a.id FROM properties p, amenities a
WHERE p.title = 'Luxury 3BHK Apartment in Koramangala'
  AND a.name IN ('Gym','Swimming Pool','24/7 Security','Parking','Lift','Central AC','Water Supply','Power Backup')
ON CONFLICT (property_id, amenity_id) DO NOTHING;

INSERT INTO property_amenities (property_id, amenity_id)
SELECT p.id, a.id FROM properties p, amenities a
WHERE p.title = 'Premium Villa with Pool in Whitefield'
  AND a.name IN ('Gym','Swimming Pool','24/7 Security','Parking','Garden','Clubhouse','Lift','Central AC','Water Supply','Power Backup','Gate')
ON CONFLICT (property_id, amenity_id) DO NOTHING;

INSERT INTO property_amenities (property_id, amenity_id)
SELECT p.id, a.id FROM properties p, amenities a
WHERE p.title = 'Modern 2BHK in Bandra West'
  AND a.name IN ('Gym','24/7 Security','Parking','Lift','Central AC','Water Supply','Power Backup')
ON CONFLICT (property_id, amenity_id) DO NOTHING;

INSERT INTO property_amenities (property_id, amenity_id)
SELECT p.id, a.id FROM properties p, amenities a
WHERE p.title = 'Spacious 3BHK in Hitech City'
  AND a.name IN ('Gym','24/7 Security','Parking','Lift','Water Supply','Power Backup')
ON CONFLICT (property_id, amenity_id) DO NOTHING;

INSERT INTO property_amenities (property_id, amenity_id)
SELECT p.id, a.id FROM properties p, amenities a
WHERE p.title = 'Independent Villa in Jubilee Hills'
  AND a.name IN ('Gym','Swimming Pool','24/7 Security','Parking','Garden','Clubhouse','Lift','Central AC','Water Supply','Power Backup','Gate','Playground')
ON CONFLICT (property_id, amenity_id) DO NOTHING;

INSERT INTO property_amenities (property_id, amenity_id)
SELECT p.id, a.id FROM properties p, amenities a
WHERE p.title = 'Affordable 1BHK in Pune'
  AND a.name IN ('24/7 Security','Parking','Lift','Water Supply','Power Backup')
ON CONFLICT (property_id, amenity_id) DO NOTHING;

INSERT INTO property_amenities (property_id, amenity_id)
SELECT p.id, a.id FROM properties p, amenities a
WHERE p.title = 'Luxury Penthouse in South Mumbai'
  AND a.name IN ('Gym','Swimming Pool','24/7 Security','Parking','Clubhouse','Lift','Central AC','Water Supply','Power Backup','Gate')
ON CONFLICT (property_id, amenity_id) DO NOTHING;

INSERT INTO property_amenities (property_id, amenity_id)
SELECT p.id, a.id FROM properties p, amenities a
WHERE p.title = '3BHK Townhouse in Sarjapur'
  AND a.name IN ('Gym','Swimming Pool','24/7 Security','Parking','Garden','Lift','Water Supply','Power Backup')
ON CONFLICT (property_id, amenity_id) DO NOTHING;

-- 7. Neighborhood Insights
INSERT INTO neighborhood_insights (location_name, latitude, longitude, schools_rating, hospitals_rating, metro_rating, shopping_rating, restaurants_rating, safety_rating)
VALUES
  ('Koramangala',  12.93490000, 77.62640000, 9.2, 8.5, 7.8, 9.0, 9.5, 8.8),
  ('Whitefield',   12.96960000, 77.75010000, 8.8, 8.0, 7.2, 8.5, 8.2, 8.5),
  ('Bandra West',  19.05960000, 72.83620000, 9.0, 9.2, 9.5, 9.3, 9.6, 8.7),
  ('Hitech City',  17.44740000, 78.37420000, 8.5, 8.8, 8.0, 8.7, 8.5, 8.3),
  ('Jubilee Hills', 17.43180000, 78.40720000, 9.1, 9.0, 7.5, 9.2, 9.0, 9.2);
