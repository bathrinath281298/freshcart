
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)
CORS(app)


def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "mysql"),
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        database=os.getenv("DB_NAME", "freshcart")
    )


@app.route("/")
def home():
    return jsonify({
        "service": "Product Service",
        "status": "running"
    })


@app.route("/health")
def health():
    try:
        conn = get_db_connection()
        conn.close()
        return jsonify({"status": "healthy"}), 200
    except Exception:
        return jsonify({"status": "unhealthy"}), 503


@app.route("/api/products", methods=["GET"])
def get_products():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, name, category, price, description, image
        FROM products
    """)

    products = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(products)


@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM products WHERE id = %s",
        (product_id,)
    )

    product = cursor.fetchone()
    cursor.close()
    conn.close()

    if not product:
        return jsonify({"error": "Product not found"}), 404

    return jsonify(product)


@app.route("/api/products", methods=["POST"])
def add_product():
    data = request.get_json(silent=True) or {}

    name = data.get("name")
    category = data.get("category")
    price = data.get("price")
    description = data.get("description", "")
    image = data.get("image", "")

    if not name or not category or price is None:
        return jsonify({
            "error": "Name, category and price are required"
        }), 400

    try:
        price = float(price)
        if price <= 0:
            raise ValueError()
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid product price"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO products
        (name, category, price, description, image)
        VALUES (%s, %s, %s, %s, %s)
    """, (name, category, price, description, image))

    conn.commit()
    product_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Product added successfully",
        "product_id": product_id
    }), 201


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
