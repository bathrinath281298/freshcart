
CREATE DATABASE IF NOT EXISTS freshcart;

USE freshcart;

-- USER TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCT TABLE
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    image TEXT
);

-- ORDER TABLE
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SAMPLE PRODUCTS
INSERT INTO products
(name, category, price, description, image)
SELECT * FROM (
    SELECT 'Fresh Apples', 'Fruits', 120.00,
    'Sweet and juicy red apples',
    'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6'
) AS sample
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE name = 'Fresh Apples'
);

INSERT INTO products
(name, category, price, description, image)
SELECT * FROM (
    SELECT 'Fresh Tomatoes', 'Vegetables', 40.00,
    'Farm fresh red tomatoes',
    'https://images.unsplash.com/photo-1546094096-0df4bcaaa337'
) AS sample
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE name = 'Fresh Tomatoes'
);

INSERT INTO products
(name, category, price, description, image)
SELECT * FROM (
    SELECT 'Fresh Milk', 'Dairy', 60.00,
    'Pure and creamy fresh milk',
    'https://images.unsplash.com/photo-1563636619-e9143da7973b'
) AS sample
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE name = 'Fresh Milk'
);

INSERT INTO products
(name, category, price, description, image)
SELECT * FROM (
    SELECT 'Fresh Carrots', 'Vegetables', 55.00,
    'Crunchy farm fresh carrots',
    'https://images.unsplash.com/photo-1445282768818-728615cc910a'
) AS sample
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE name = 'Fresh Carrots'
);

INSERT INTO products
(name, category, price, description, image)
SELECT * FROM (
    SELECT 'Fresh Bread', 'Bakery', 45.00,
    'Soft freshly baked bread',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff'
) AS sample
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE name = 'Fresh Bread'
);

INSERT INTO products
(name, category, price, description, image)
SELECT * FROM (
    SELECT 'Fresh Bananas', 'Fruits', 60.00,
    'Naturally sweet bananas',
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e'
) AS sample
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE name = 'Fresh Bananas'
);

INSERT INTO products
(name, category, price, description, image)
SELECT * FROM (
    SELECT 'Fresh Broccoli', 'Vegetables', 80.00,
    'Fresh green broccoli',
    'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc'
) AS sample
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE name = 'Fresh Broccoli'
);

INSERT INTO products
(name, category, price, description, image)
SELECT * FROM (
    SELECT 'Premium Cheese', 'Dairy', 150.00,
    'Creamy premium cheese',
    'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d'
) AS sample
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE name = 'Premium Cheese'
);
