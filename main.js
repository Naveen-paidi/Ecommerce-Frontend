// --- DOM Elements ---
const productContainer = document.getElementById("products");
const searchBox = document.querySelector(".search-box-input");
const categoryFilter = document.getElementById("category-filter");
const priceFilter = document.getElementById("price-filter");

// --- Render Products Function ---
function renderProducts(list) {
  productContainer.innerHTML = "";

  if (list.length === 0) {
    productContainer.innerHTML = "<p>No products found.</p>";
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  for (let product of list) {
    const cardContainer = document.createElement("div");
    cardContainer.classList.add(
      "card",
      "card-vertical",
      "d-flex",
      "direction-column",
      "relative",
      "shadow"
    );

    // 🖼️ Image Section
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("card-image-container");

    const image = document.createElement("img");
    image.classList.add("card-image");
    image.src = product.img;
    image.alt = product.name;
    imageContainer.appendChild(image);

    // 🧾 Details Section
    const cardDetailsContainer = document.createElement("div");
    cardDetailsContainer.classList.add("card-details");

    const brandContainer = document.createElement("div");
    brandContainer.classList.add("card-title");
    brandContainer.innerText = product.brand;
    cardDetailsContainer.appendChild(brandContainer);

    // 💬 Description
    const descriptionContainer = document.createElement("div");
    descriptionContainer.classList.add("card-description");

    const name = document.createElement("p");
    name.classList.add("card-des");
    name.innerText = product.name;
    descriptionContainer.appendChild(name);

    // 💰 Price Section
    const price = document.createElement("p");
    price.classList.add("card-price", "d-flex", "align-end", "gap-sm");
    price.innerText = `Rs. ${product.newPrice}`;

    const oldPrice = document.createElement("span");
    oldPrice.classList.add("price-strike-through");
    oldPrice.innerText = `Rs ${product.oldPrice}`;
    price.appendChild(oldPrice);

    const discount = document.createElement("span");
    discount.classList.add("discount");
    discount.innerText = `(${product.discount}% OFF)`;
    price.appendChild(discount);

    descriptionContainer.appendChild(price);

    // ⭐ Ratings
    const ratings = document.createElement("p");
    ratings.classList.add("d-flex", "align-center");

    const rating = document.createElement("span");
    rating.innerText = product.rating;
    ratings.appendChild(rating);

    const star = document.createElement("span");
    star.classList.add("material-icons-outlined", "star");
    star.innerText = "star";
    ratings.appendChild(star);

    descriptionContainer.appendChild(ratings);
    cardDetailsContainer.appendChild(descriptionContainer);

    // 🛒 CTA Button
    const ctaButton = document.createElement("div");
    const cartButton = document.createElement("button");
    cartButton.classList.add(
      "button",
      "btn-primary",
      "btn-icon",
      "cart-btn",
      "d-flex",
      "align-center",
      "justify-center",
      "gap",
      "cursor",
      "btn-margin"
    );
    cartButton.setAttribute("data-id", product._id);

    const cartIcon = document.createElement("span");
    cartIcon.classList.add("material-icons-outlined");
    cartIcon.innerText = "shopping_cart";
    cartButton.appendChild(cartIcon);

    const buttonText = document.createElement("span");
    buttonText.innerText = cart.some(item => item._id === product._id)
      ? "Go to Cart"
      : "Add To Cart";
    cartButton.appendChild(buttonText);

    // Add event
    cartButton.addEventListener("click", () => {
      const exists = cart.find(item => item._id === product._id);
      if (!exists) {
        addToCart(product, cartButton);
      } else {
        window.location.href = "./cart.html";
      }
    });

    ctaButton.appendChild(cartButton);
    cardDetailsContainer.appendChild(ctaButton);

    // Combine everything
    cardContainer.appendChild(imageContainer);
    cardContainer.appendChild(cardDetailsContainer);
    productContainer.appendChild(cardContainer);
  }
}

// --- Add to Cart Function ---
function addToCart(product, button) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));

  // Change button text to "Go to Cart"
  button.innerHTML = `<span class="material-icons-outlined">shopping_cart</span><span>Go to Cart</span>`;

  // Add click redirect
  button.addEventListener("click", () => {
    window.location.href = "./cart.html";
  });

  alert(`${product.name} added to cart!`);
}

// --- Filter + Search Logic ---
function filterProducts() {
  const category = categoryFilter.value; // all / men / women
  const priceRange = priceFilter.value;  // all / low / mid / high
  const query = searchBox.value.toLowerCase().trim();

  let filtered = products;

  // 1️⃣ Filter by category
  if (category === "men") {
    filtered = filtered.filter(p => p.idealFor === "M");
  } else if (category === "women") {
    filtered = filtered.filter(p => p.idealFor === "W");
  }

  // 2️⃣ Filter by price
  if (priceRange === "low") {
    filtered = filtered.filter(p => p.newPrice <= 1000);
  } else if (priceRange === "mid") {
    filtered = filtered.filter(p => p.newPrice > 1000 && p.newPrice < 2000);
  } else if (priceRange === "high") {
    filtered = filtered.filter(p => p.newPrice >= 2000);
  }

  // 3️⃣ Search filter
  if (query) {
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
    );
  }

  renderProducts(filtered);
}

// --- Event Listeners ---
categoryFilter.addEventListener("change", filterProducts);
priceFilter.addEventListener("change", filterProducts);
searchBox.addEventListener("input", filterProducts);

// --- Initial Render ---
renderProducts(products);
