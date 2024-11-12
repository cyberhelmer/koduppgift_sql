-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS orders_db;

-- Use the created database
USE orders_db;

-- Create the `orders` table
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the `order_items` table to store the products in each order
CREATE TABLE IF NOT EXISTS Order_Items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    article_number VARCHAR(50) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE
);
