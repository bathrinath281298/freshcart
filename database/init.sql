CREATE DATABASE IF NOT EXISTS freshcart;

USE freshcart;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    image TEXT
);

INSERT INTO products
(name, category, price, description, image)
VALUES

(
    'Fresh Apples',
    'Fruits',
    120,
    'Sweet and juicy red apples',
    'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6'
),

(
    'Fresh Tomatoes',
    'Vegetables',
    40,
    'Farm fresh red tomatoes',
    'https://images.unsplash.com/photo-1546094096-0df4bcaaa337'
),

(
    'Fresh Milk',
    'Dairy',
    60,
    'Pure and creamy fresh milk',
    'https://images.unsplash.com/photo-1563636619-e9143da7973b'
),

(
    'Fresh Carrots',
    'Vegetables',
    55,
    'Crunchy farm fresh carrots',
    'https://images.unsplash.com/photo-1445282768818-728615cc910a'
),

(
    'Fresh Bread',
    'Bakery',
    45,
    'Soft freshly baked bread',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff'
),

(
    'Fresh Bananas',
    'Fruits',
    60,
    'Naturally sweet bananas',
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e'
),

(
    'Fresh Broccoli',
    'Vegetables',
    80,
    'Fresh green broccoli',
    'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc'
),

(
    'Premium Cheese',
    'Dairy',
    150,
    'Creamy premium cheese',
    'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d'
);