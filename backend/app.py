from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector
import os

app = Flask(__name__)

CORS(app)


def get_db_connection():

    return mysql.connector.connect(

        host=os.getenv("DB_HOST", "localhost"),

        user=os.getenv(
            "DB_USER",
            "freshcart"
        ),

        password=os.getenv(
            "DB_PASSWORD",
            "freshcart123"
        ),

        database=os.getenv(
            "DB_NAME",
            "freshcart"
        )

    )


@app.route("/")
def home():

    return jsonify({

        "message":
        "FreshCart Backend is running",

        "status":
        "success"

    })


@app.route("/api/products")
def get_products():

    try:

        connection = get_db_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT
                id,
                name,
                category,
                price,
                description,
                image
            FROM products
            """
        )

        products = cursor.fetchall()

        cursor.close()

        connection.close()

        return jsonify(products)

    except Exception as e:

        return jsonify({

            "error":
            str(e)

        }), 500


if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )