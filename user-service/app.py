
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
        "service": "User Service",
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


@app.route("/api/users", methods=["POST"])
def create_user():
    data = request.get_json(silent=True) or {}

    name = data.get("name")
    email = data.get("email")

    if not name or not email:
        return jsonify({
            "error": "Name and email are required"
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (name, email) VALUES (%s, %s)",
            (name, email)
        )
        conn.commit()

        return jsonify({
            "message": "User registered successfully",
            "user_id": cursor.lastrowid
        }), 201

    except mysql.connector.IntegrityError:
        return jsonify({"error": "Email already exists"}), 409

    finally:
        cursor.close()
        conn.close()


@app.route("/api/users", methods=["GET"])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT id, name, email FROM users"
    )

    users = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(users)


@app.route("/api/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT id, name, email FROM users WHERE id = %s",
        (user_id,)
    )

    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)

