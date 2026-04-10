-- Real Estate Platform Database Schema
-- Drop and recreate for clean setup

CREATE DATABASE IF NOT EXISTS realstate_db;
USE realstate_db;

-- Users Table (with role)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  profile_image VARCHAR(500),
  address TEXT,
  role ENUM('user', 'admin', 'agent') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Agents Table
CREATE TABLE IF NOT EXISTS agents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  specialization VARCHAR(100),
  experience_years INT,
  properties_sold INT DEFAULT 0,
  rating DECIMAL(3,2),
  bio TEXT,
  whatsapp VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  property_type ENUM('apartment', 'villa', 'townhouse', 'commercial', 'land') NOT NULL,
  bhk INT,
  price BIGINT NOT NULL,
  price_currency VARCHAR(10) DEFAULT 'INR',
  location VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(20),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  area_sqft INT,
  build_year INT,
  agent_id INT,
  status ENUM('available', 'sold', 'under_offer', 'pending') DEFAULT 'available',
  featured BOOLEAN DEFAULT FALSE,
  virtual_tour_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL,
  INDEX idx_city (city),
  INDEX idx_status (status),
  INDEX idx_price (price),
  INDEX idx_property_type (property_type)
);

-- Property Images Table
CREATE TABLE IF NOT EXISTS property_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_title VARCHAR(255),
  display_order INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  INDEX idx_property (property_id)
);

-- Amenities Table
CREATE TABLE IF NOT EXISTS amenities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(255),
  category VARCHAR(50)
);

-- Property Amenities Junction
CREATE TABLE IF NOT EXISTS property_amenities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  amenity_id INT NOT NULL,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE,
  UNIQUE KEY unique_property_amenity (property_id, amenity_id)
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  user_id INT,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  message TEXT,
  inquiry_type ENUM('call_back', 'schedule_visit', 'general', 'emi_query') DEFAULT 'general',
  status ENUM('new', 'contacted', 'scheduled', 'closed') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP NULL,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_property (property_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
);

-- Scheduled Visits Table
CREATE TABLE IF NOT EXISTS scheduled_visits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  user_id INT,
  visitor_name VARCHAR(255),
  visitor_email VARCHAR(255),
  visitor_phone VARCHAR(20),
  visit_date DATE NOT NULL,
  visit_time TIME NOT NULL,
  status ENUM('scheduled', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_property (property_id),
  INDEX idx_visit_date (visit_date)
);

-- Neighborhood Insights Table
CREATE TABLE IF NOT EXISTS neighborhood_insights (
  id INT PRIMARY KEY AUTO_INCREMENT,
  location_name VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  schools_rating DECIMAL(3,2),
  hospitals_rating DECIMAL(3,2),
  metro_rating DECIMAL(3,2),
  shopping_rating DECIMAL(3,2),
  restaurants_rating DECIMAL(3,2),
  safety_rating DECIMAL(3,2),
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- EMI Calculations Table
CREATE TABLE IF NOT EXISTS emi_calculations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  property_id INT,
  principal_amount BIGINT,
  rate_of_interest DECIMAL(5,2),
  tenure_years INT,
  monthly_emi BIGINT,
  total_amount BIGINT,
  total_interest BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
);

-- Admin Settings Table
CREATE TABLE IF NOT EXISTS admin_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value VARCHAR(500),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Property Price History Table
CREATE TABLE IF NOT EXISTS property_price_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  old_price BIGINT,
  new_price BIGINT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- ─── SEED DATA ────────────────────────────────────────────────

-- Amenities
INSERT IGNORE INTO amenities (name, icon, category) VALUES
('Gym', 'dumbbell', 'fitness'),
('Swimming Pool', 'waves', 'recreation'),
('24/7 Security', 'shield', 'security'),
('Parking', 'car', 'facility'),
('Garden', 'leaf', 'outdoor'),
('Clubhouse', 'home', 'community'),
('Lift', 'arrow-up', 'facility'),
('Central AC', 'wind', 'utility'),
('Water Supply', 'droplet', 'utility'),
('Power Backup', 'battery', 'utility'),
('Gate', 'lock', 'security'),
('Playground', 'play-circle', 'recreation');

-- Admin user (password: admin123)
INSERT IGNORE INTO users (name, email, phone, password_hash, role) VALUES
('Admin User', 'admin@shinenative.com', '+911234567890',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Agent users
INSERT IGNORE INTO users (name, email, phone, password_hash, role) VALUES
('Rajesh Kumar', 'rajesh@techprop.com', '+919876543210',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'agent'),
('Priya Sharma', 'priya@techprop.com', '+919876543211',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'agent');

-- Agents
INSERT IGNORE INTO agents (user_id, specialization, experience_years, properties_sold, rating, bio, whatsapp) VALUES
(2, 'Luxury Residential', 8, 45, 4.8, 'Specialist in luxury residential properties across Bangalore with 8 years of experience.', '919876543210'),
(3, 'Commercial & Residential', 5, 28, 4.6, 'Expert in both commercial and residential properties in Mumbai and Pune.', '919876543211');

-- Sample Properties
INSERT IGNORE INTO properties (title, description, property_type, bhk, price, location, city, state, postal_code, latitude, longitude, area_sqft, build_year, agent_id, status, featured) VALUES
('Luxury 3BHK Apartment in Koramangala', 'A stunning 3BHK apartment in the heart of Koramangala with premium finishes, modular kitchen, and breathtaking city views. The property features spacious rooms, marble flooring, and a private balcony.', 'apartment', 3, 12500000, 'Koramangala 5th Block', 'Bangalore', 'Karnataka', '560095', 12.93490000, 77.62640000, 1850, 2021, 1, 'available', TRUE),
('Premium Villa with Pool in Whitefield', 'An exquisite 4BHK villa with a private swimming pool, landscaped garden, and smart home automation. Located in a gated community with 24/7 security.', 'villa', 4, 35000000, 'Whitefield Main Road', 'Bangalore', 'Karnataka', '560066', 12.96960000, 77.75010000, 4200, 2020, 1, 'available', TRUE),
('Modern 2BHK in Bandra West', 'Contemporary 2BHK apartment in the most sought-after locality of Mumbai. Walking distance to Bandra station, restaurants, and shopping.', 'apartment', 2, 18500000, 'Bandra West', 'Mumbai', 'Maharashtra', '400050', 19.05960000, 72.83620000, 1100, 2022, 2, 'available', TRUE),
('Spacious 3BHK in Hitech City', 'Well-designed 3BHK apartment near Hitech City IT hub. Perfect for IT professionals with excellent connectivity to major tech parks.', 'apartment', 3, 9800000, 'Hitech City', 'Hyderabad', 'Telangana', '500081', 17.44740000, 78.37420000, 1650, 2021, 2, 'available', FALSE),
('Independent Villa in Jubilee Hills', 'Elegant 5BHK independent villa in the prestigious Jubilee Hills locality. Features a home theatre, gym, and rooftop terrace.', 'villa', 5, 65000000, 'Jubilee Hills Road No. 36', 'Hyderabad', 'Telangana', '500033', 17.43180000, 78.40720000, 5500, 2019, 1, 'available', TRUE),
('Affordable 1BHK in Pune', 'Compact and well-designed 1BHK apartment in Wakad, Pune. Ideal for young professionals. Close to Hinjewadi IT Park.', 'apartment', 1, 4500000, 'Wakad', 'Pune', 'Maharashtra', '411057', 18.59870000, 73.76140000, 650, 2022, 2, 'available', FALSE),
('Commercial Office Space in MG Road', 'Premium commercial office space on MG Road with modern infrastructure, high-speed internet, and ample parking. Suitable for IT and consulting firms.', 'commercial', NULL, 25000000, 'MG Road', 'Bangalore', 'Karnataka', '560001', 12.97560000, 77.60990000, 3000, 2020, 1, 'available', FALSE),
('Luxury Penthouse in South Mumbai', 'Ultra-luxury 4BHK penthouse with panoramic sea views, private terrace, and world-class amenities. A rare gem in South Mumbai.', 'apartment', 4, 95000000, 'Worli Sea Face', 'Mumbai', 'Maharashtra', '400018', 19.01760000, 72.81620000, 6000, 2021, 2, 'available', TRUE),
('3BHK Townhouse in Sarjapur', 'Beautiful 3BHK townhouse in a premium gated community. Features private garden, modular kitchen, and excellent connectivity to Electronic City.', 'townhouse', 3, 8500000, 'Sarjapur Road', 'Bangalore', 'Karnataka', '560035', 12.85560000, 77.69870000, 2100, 2022, 1, 'available', FALSE),
('Plot in Devanahalli', 'Prime residential plot near Kempegowda International Airport. Excellent investment opportunity in the fastest growing corridor of Bangalore.', 'land', NULL, 6500000, 'Devanahalli', 'Bangalore', 'Karnataka', '562110', 13.24870000, 77.71230000, 2400, NULL, 1, 'available', FALSE);

-- Property Images
INSERT IGNORE INTO property_images (property_id, image_url, display_order) VALUES
(1, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', 1),
(1, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', 2),
(1, 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', 3),
(2, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', 1),
(2, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', 2),
(3, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 1),
(3, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', 2),
(4, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', 1),
(5, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80', 1),
(5, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', 2),
(6, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 1),
(7, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 1),
(8, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', 1),
(8, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', 2),
(9, 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80', 1),
(10, 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', 1);

-- Property Amenities
INSERT IGNORE INTO property_amenities (property_id, amenity_id) VALUES
(1,1),(1,2),(1,3),(1,4),(1,7),(1,8),(1,9),(1,10),
(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),(2,9),(2,10),(2,11),
(3,1),(3,3),(3,4),(3,7),(3,8),(3,9),(3,10),
(4,1),(4,3),(4,4),(4,7),(4,9),(4,10),
(5,1),(5,2),(5,3),(5,4),(5,5),(5,6),(5,7),(5,8),(5,9),(5,10),(5,11),(5,12),
(6,3),(6,4),(6,7),(6,9),(6,10),
(8,1),(8,2),(8,3),(8,4),(8,6),(8,7),(8,8),(8,9),(8,10),(8,11),
(9,1),(9,2),(9,3),(9,4),(9,5),(9,7),(9,9),(9,10);

-- Neighborhood Insights
INSERT IGNORE INTO neighborhood_insights (location_name, latitude, longitude, schools_rating, hospitals_rating, metro_rating, shopping_rating, restaurants_rating, safety_rating) VALUES
('Koramangala', 12.93490000, 77.62640000, 9.2, 8.5, 7.8, 9.0, 9.5, 8.8),
('Whitefield', 12.96960000, 77.75010000, 8.8, 8.0, 7.2, 8.5, 8.2, 8.5),
('Bandra West', 19.05960000, 72.83620000, 9.0, 9.2, 9.5, 9.3, 9.6, 8.7),
('Hitech City', 17.44740000, 78.37420000, 8.5, 8.8, 8.0, 8.7, 8.5, 8.3),
('Jubilee Hills', 17.43180000, 78.40720000, 9.1, 9.0, 7.5, 9.2, 9.0, 9.2);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_city_status ON properties(city, status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_agents_user ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_status ON inquiries(property_id, status);
CREATE INDEX IF NOT EXISTS idx_scheduled_visits_property ON scheduled_visits(property_id);
