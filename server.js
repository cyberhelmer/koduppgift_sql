const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const mysql = require("mysql2/promise");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public")); // Serve static files like HTML, CSS, JS

// Connect to the database
const pool = mysql.createPool({
    host: "localhost",
    user: "root", 
    password: "new_password", 
    database: "orders_db", 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Endpoint to serve products from JSON
app.get("/api/products", (req, res) => {
    fs.readFile("industrial.json", "utf8", (err, data) => {
        if (err) {
            console.error("Error reading industrial.json:", err);
            res.status(500).json({ error: "Failed to load products" });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Endpoint to handle order submissions
app.post("/api/orders", async (req, res) => {
    const { customerName, products } = req.body;

    // Ensure the customer name is entered and minimum one product is selected
    if (!customerName || !products || products.length === 0) {
        return res.status(400).json({ error: "Invalid order data" });
    }

    let connection;
    try {
        // Get a MySQL connection from the pool
        connection = await pool.getConnection();

        // Start a transaction
        await connection.beginTransaction();

        // Insert the order into the Orders table and get the order ID
        const [orderResult] = await connection.execute(
            "INSERT INTO Orders (customer_name) VALUES (?)",
            [customerName]
        );
        const orderId = orderResult.insertId;

        // Insert each product associated with the order ID into the Order_Items table
        const insertOrderProductQuery = "INSERT INTO Order_Items (order_id, article_number) VALUES (?, ?)";
        for (let articleNumber of products) {
            await connection.execute(insertOrderProductQuery, [orderId, articleNumber]);
        }

        // Commit the transaction
        await connection.commit();

        // Close the connection
        connection.release();

        // Respond with success
        res.status(201).json({ message: "Order created successfully" });
    } catch (err) {
        // If an error occurs, rollback the transaction
        if (connection) await connection.rollback();
        console.error("Error creating order:", err);
        res.status(500).json({ error: "Failed to create order" });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
