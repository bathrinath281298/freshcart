import { useState } from "react";
import {
  ShoppingCart,
  Search,
  Apple,
  Milk,
  Carrot,
  Cookie,
  Plus,
  Minus,
  Trash2
} from "lucide-react";

import "./App.css";

const products = [
  {
    id: 1,
    name: "Fresh kashmir apple",
    category: "Fruits",
    price: 120,
    description: "Sweet and juicy red apples",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6"
  },
  {
    id: 2,
    name: "Fresh Tomatoes",
    category: "Vegetables",
    price: 40,
    description: "Farm fresh red tomatoes",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337"
  },
  {
    id: 3,
    name: "Fresh Milk",
    category: "Dairy",
    price: 60,
    description: "Pure and creamy fresh milk",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b"
  },
  {
    id: 4,
    name: "Fresh Carrots",
    category: "Vegetables",
    price: 55,
    description: "Crunchy farm fresh carrots",
    image: "https://images.unsplash.com/photo-1445282768818-728615cc910a"
  },
  {
    id: 5,
    name: "Fresh Bread",
    category: "Bakery",
    price: 45,
    description: "Soft freshly baked bread",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff"
  },
  {
    id: 6,
    name: "Bananas",
    category: "Fruits",
    price: 60,
    description: "Naturally sweet bananas",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e"
  },
  {
    id: 7,
    name: "Broccoli",
    category: "Vegetables",
    price: 80,
    description: "Fresh green broccoli",
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc"
  },
  {
    id: 8,
    name: "Cheese",
    category: "Dairy",
    price: 150,
    description: "Creamy premium cheese",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d"
  }
];

function App() {

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const addToCart = (product) => {

    const existing = cart.find(
      item => item.id === product.id
    );

    if (existing) {

      setCart(
        cart.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        )
      );

    } else {

      setCart([
        ...cart,
        {
          ...product,
          quantity: 1
        }
      ]);

    }
  };

  const increase = (id) => {

    setCart(
      cart.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );

  };

  const decrease = (id) => {

    setCart(
      cart
        .map(item =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter(item => item.quantity > 0)
    );

  };

  const removeItem = (id) => {

    setCart(
      cart.filter(item => item.id !== id)
    );

  };

  const filteredProducts = products.filter(product => {

    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;

  });

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  return (

    <div className="app">

      {/* HEADER */}

      <header>

        <div className="logo">
          🛒 FreshCart
        </div>

        <div className="search">

          <Search size={20} />

          <input
            type="text"
            placeholder="Search groceries..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="cart-button">

          <ShoppingCart size={25} />

          <span>
            {cartCount}
          </span>

        </div>

      </header>


      {/* HERO */}

      <section className="hero">

        <div className="hero-content">

          <p className="small-title">
            FRESH • HEALTHY • FAST
          </p>

          <h1>
            Fresh groceries,
            <br />
            delivered to your door.
          </h1>

          <p>
            Shop fresh fruits, vegetables,
            dairy and everyday essentials
            from FreshCart.
          </p>

          <button
            onClick={() =>
              window.scrollTo({
                top: 500,
                behavior: "smooth"
              })
            }
          >
            Shop Now
          </button>

        </div>

        <div className="hero-image">
          🥬
        </div>

      </section>


      {/* CATEGORIES */}

      <section className="categories">

        <h2>
          Shop by Category
        </h2>

        <div className="category-list">

          <button
            onClick={() =>
              setCategory("All")
            }
          >
            🛍️
            <span>All</span>
          </button>

          <button
            onClick={() =>
              setCategory("Fruits")
            }
          >
            <Apple />
            <span>Fruits</span>
          </button>

          <button
            onClick={() =>
              setCategory("Vegetables")
            }
          >
            <Carrot />
            <span>Vegetables</span>
          </button>

          <button
            onClick={() =>
              setCategory("Dairy")
            }
          >
            <Milk />
            <span>Dairy</span>
          </button>

          <button
            onClick={() =>
              setCategory("Bakery")
            }
          >
            <Cookie />
            <span>Bakery</span>
          </button>

        </div>

      </section>


      {/* PRODUCTS */}

      <section className="products">

        <div className="section-title">

          <div>

            <p>
              OUR PRODUCTS
            </p>

            <h2>
              Popular groceries
            </h2>

          </div>

          <span>
            {filteredProducts.length} products
          </span>

        </div>


        <div className="product-grid">

          {filteredProducts.map(product => (

            <div
              className="product-card"
              key={product.id}
            >

              <div className="product-image">

                <img
                  src={product.image}
                  alt={product.name}
                />

              </div>

              <div className="product-info">

                <small>
                  {product.category}
                </small>

                <h3>
                  {product.name}
                </h3>

                <p>
                  {product.description}
                </p>

                <div className="product-bottom">

                  <strong>
                    ₹{product.price}
                  </strong>

                  <button
                    onClick={() =>
                      addToCart(product)
                    }
                  >
                    <Plus size={17} />
                    Add
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* CART */}

      <section className="cart-section">

        <div className="cart-header">

          <h2>
            Your Cart
          </h2>

          <span>
            {cartCount} items
          </span>

        </div>


        {cart.length === 0 ? (

          <div className="empty-cart">

            <ShoppingCart size={45} />

            <h3>
              Your cart is empty
            </h3>

            <p>
              Add some fresh groceries to
              get started.
            </p>

          </div>

        ) : (

          <>

            {cart.map(item => (

              <div
                className="cart-item"
                key={item.id}
              >

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div>

                  <h3>
                    {item.name}
                  </h3>

                  <strong>
                    ₹{item.price}
                  </strong>

                </div>

                <div className="quantity">

                  <button
                    onClick={() =>
                      decrease(item.id)
                    }
                  >
                    <Minus size={15} />
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increase(item.id)
                    }
                  >
                    <Plus size={15} />
                  </button>

                </div>

                <strong>
                  ₹{item.price * item.quantity}
                </strong>

                <button
                  className="delete"
                  onClick={() =>
                    removeItem(item.id)
                  }
                >
                  <Trash2 size={18} />
                </button>

              </div>

            ))}


            <div className="checkout">

              <div>

                <span>
                  Total
                </span>

                <strong>
                  ₹{total}
                </strong>

              </div>

              <button>
                Proceed to Checkout
              </button>

            </div>

          </>

        )}

      </section>


      {/* FOOTER */}

      <footer>

        <strong>
          🛒 FreshCart
        </strong>

        <p>
          Fresh groceries. Better living.
        </p>

      </footer>

    </div>

  );
}

export default App;
