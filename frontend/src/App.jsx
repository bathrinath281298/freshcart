
import { useState, useEffect } from "react";

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

function App() {

  // CART STATE
  const [cart, setCart] = useState([]);

  // PRODUCT STATE
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // SEARCH AND CATEGORY STATE
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // CHECKOUT STATE
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderMessage, setOrderMessage] = useState("");

  // FETCH PRODUCTS FROM PRODUCT SERVICE
  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Unable to fetch products");
        }

        const data = await response.json();

        setProducts(data);

      } catch (err) {

        setError(err.message);

      } finally {

        setLoading(false);

      }

    };

    fetchProducts();

  }, []);

  // ADD PRODUCT TO CART
  const addToCart = (product) => {

    setCart(previousCart => {

      const existing = previousCart.find(
        item => item.id === product.id
      );

      if (existing) {

        return previousCart.map(item =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        );

      }

      return [
        ...previousCart,
        {
          ...product,
          quantity: 1
        }
      ];

    });

    setOrderMessage("");

  };

  // INCREASE QUANTITY
  const increase = (id) => {

    setCart(previousCart =>
      previousCart.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );

  };

  // DECREASE QUANTITY
  const decrease = (id) => {

    setCart(previousCart =>
      previousCart
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

  // REMOVE PRODUCT
  const removeItem = (id) => {

    setCart(previousCart =>
      previousCart.filter(item => item.id !== id)
    );

  };

  // FILTER PRODUCTS
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

  // CART TOTAL
  const total = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  // CART COUNT
  const cartCount = cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  // CHECKOUT FUNCTION
  const checkout = async () => {

    if (cart.length === 0) {

      alert("Your cart is empty");
      return;

    }

    const name = window.prompt("Enter your name:");

    if (!name || !name.trim()) {
      return;
    }

    const email = window.prompt("Enter your email:");

    if (!email || !email.trim()) {
      return;
    }

    setCheckingOut(true);
    setOrderMessage("");

    try {

      // STEP 1: REGISTER CUSTOMER THROUGH USER SERVICE

      const userResponse = await fetch("/api/users", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name: name.trim(),
          email: email.trim()
        })

      });

      const userData = await userResponse.json();

      let userId;

      if (userResponse.status === 409) {

        // EMAIL ALREADY EXISTS - LOOK UP EXISTING CUSTOMER

        const existingUserResponse = await fetch("/api/users");

        if (!existingUserResponse.ok) {
          throw new Error("Unable to retrieve existing customer");
        }

        const existingUsers = await existingUserResponse.json();

        const existingUser = existingUsers.find(
          user =>
            user.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (!existingUser) {
          throw new Error("Existing customer could not be found");
        }

        userId = existingUser.id;

      } else if (!userResponse.ok) {

        throw new Error(
          userData.error || "Customer registration failed"
        );

      } else {

        userId = userData.user_id;

      }

      // STEP 2: PLACE ORDERS THROUGH ORDER SERVICE

      const orderResults = [];

      for (const item of cart) {

        const orderResponse = await fetch("/api/orders", {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            user_id: userId,

            product_id: item.id,

            quantity: item.quantity

          })

        });

        const orderData = await orderResponse.json();

        if (!orderResponse.ok) {

          throw new Error(
            orderData.error || "Unable to place order"
          );

        }

        orderResults.push(orderData);

      }

      // STEP 3: SHOW ORDER CONFIRMATION

      const orderIds = orderResults
        .map(order => order.order_id)
        .join(", ");

      const finalTotal = orderResults.reduce(
        (sum, order) =>
          sum + Number(order.total_price),
        0
      );

      setOrderMessage(
        `Order placed successfully! Order ID(s): ${orderIds}. Total: ₹${finalTotal.toFixed(2)}`
      );

      // CLEAR CART AFTER SUCCESSFUL ORDER

      setCart([]);

    } catch (err) {

      setOrderMessage(
        `Checkout failed: ${err.message}`
      );

    } finally {

      setCheckingOut(false);

    }

  };

  return (

    <div className="app">

      {/* HEADER */}

      <header>

        <div className="logo">
          🛒 FreshCart daily products
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

          <button onClick={() => setCategory("All")}>
            🛍️
            <span>All</span>
          </button>

          <button onClick={() => setCategory("Fruits")}>
            <Apple />
            <span>Fruits</span>
          </button>

          <button onClick={() => setCategory("Vegetables")}>
            <Carrot />
            <span>Vegetables</span>
          </button>

          <button onClick={() => setCategory("Dairy")}>
            <Milk />
            <span>Dairy</span>
          </button>

          <button onClick={() => setCategory("Bakery")}>
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

          {loading && (
            <p>Loading products...</p>
          )}

          {error && (
            <p>{error}</p>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <p>No products found.</p>
          )}

          {!loading && !error && filteredProducts.map(product => (

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
                    ₹{Number(product.price).toFixed(2)}
                  </strong>

                  <button
                    onClick={() => addToCart(product)}
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
                    ₹{Number(item.price).toFixed(2)}
                  </strong>

                </div>

                <div className="quantity">

                  <button
                    onClick={() => decrease(item.id)}
                  >
                    <Minus size={15} />
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increase(item.id)}
                  >
                    <Plus size={15} />
                  </button>

                </div>

                <strong>
                  ₹{(
                    Number(item.price) * item.quantity
                  ).toFixed(2)}
                </strong>

                <button
                  className="delete"
                  onClick={() => removeItem(item.id)}
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
                  ₹{total.toFixed(2)}
                </strong>

              </div>

              <button
                onClick={checkout}
                disabled={checkingOut}
              >
                {checkingOut
                  ? "Processing..."
                  : "Proceed to Checkout"}
              </button>

            </div>

          </>

        )}

        {orderMessage && (
          <p role="status">
            {orderMessage}
          </p>
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
