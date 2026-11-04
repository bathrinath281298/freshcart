
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import requests
import os

app = Flask(__name__)
CORS(app)

USER_SERVICE_URL = os.getenv(
    "USER_SERVICE_URL",
    "http://user-service:5001"
)

PRODUCT_SERVICE_URL = os.getenv(
    "PRODUCT_SERVICE_URL",
    "http://product-service:5002"
)


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
        "service": "Order Service",
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


@app.route("/api/orders", methods=["POST"])
def create_order():

    data = request.get_json(silent=True) or {}

    try:
        user_id = int(data["user_id"])
        product_id = int(data["product_id"])
        quantity = int(data["quantity"])

        if user_id <= 0 or product_id <= 0 or quantity <= 0:
            raise ValueError()

    except (KeyError, ValueError, TypeError):
        return jsonify({
            "error": "Valid user_id, product_id and quantity are required"
        }), 400

    try:
        user_response = requests.get(
            f"{USER_SERVICE_URL}/api/users/{user_id}",
            timeout=5
        )

        if user_response.status_code == 404:
            return jsonify({"error": "User not found"}), 404

        user_response.raise_for_status()

        product_response = requests.get(
            f"{PRODUCT_SERVICE_URL}/api/products/{product_id}",
            timeout=5
        )

        if product_response.status_code == 404:
            return jsonify({"error": "Product not found"}), 404

        product_response.raise_for_status()

        user = user_response.json()
        product = product_response.json()

    except requests.RequestException:
        return jsonify({
            "error": "User or Product Service is unavailable"
        }), 503

    total_price = float(product["price"]) * quantity

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            INSERT INTO orders
            (user_id, product_id, quantity, total_price)
            VALUES (%s, %s, %s, %s)
        """, (user_id, product_id, quantity, total_price))

        conn.commit()
        order_id = cursor.lastrowid

        return jsonify({
            "message": "Order placed successfully",
            "order_id": order_id,
            "customer": user["name"],
            "product": product["name"],
            "quantity": quantity,
            "total_price": total_price
        }), 201

    finally:
        cursor.close()
        conn.close()


@app.route("/api/orders", methods=["GET"])
def get_orders():

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM orders")

    orders = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(orders)


@app.route("/api/orders/<int:order_id>", methods=["GET"])
def get_order(order_id):

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM orders WHERE id = %s",
        (order_id,)
    )

    order = cursor.fetchone()

    cursor.close()
    conn.close()

    if not order:
        return jsonify({"error": "Order not found"}), 404

    return jsonify(order)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5003)
