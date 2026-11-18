
const imageList = [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500",
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500",
    "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=500",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500",
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500",
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500"
];

const baseBooks = [
    ["The Alchemist", "Paulo Coelho", "Fiction", 299],
    ["Atomic Habits", "James Clear", "Business", 399],
    ["Rich Dad Poor Dad", "Robert Kiyosaki", "Business", 350],
    ["The Power of Now", "Eckhart Tolle", "Fiction", 280],
    ["Wings of Fire", "A.P.J. Abdul Kalam", "Science", 320],
    ["Think and Grow Rich", "Napoleon Hill", "Business", 299],
    ["The Psychology of Money", "Morgan Housel", "Business", 450],
    ["Brief History of Time", "Stephen Hawking", "Science", 399],
    ["The Great Gatsby", "F. Scott Fitzgerald", "Fiction", 250],
    ["India After Gandhi", "Ramachandra Guha", "History", 499],
    ["Clean Code", "Robert C. Martin", "Technology", 550],
    ["JavaScript Basics", "John Smith", "Technology", 399],
    ["Python Programming", "Mark Lutz", "Technology", 499],
    ["The Intelligent Investor", "Benjamin Graham", "Business", 450],
    ["The Art of War", "Sun Tzu", "History", 220],
    ["Deep Work", "Cal Newport", "Business", 350],
    ["Ikigai", "Hector Garcia", "Fiction", 299],
    ["The Blue Umbrella", "Ruskin Bond", "Fiction", 199],
    ["Cosmos", "Carl Sagan", "Science", 420],
    ["World History", "William McNeill", "History", 480]
];

// Generate 500 sample book entries
const books = [];

for (let i = 0; i < 500; i++) {
    const original = baseBooks[i % baseBooks.length];
    const volume = Math.floor(i / baseBooks.length) + 1;

    books.push({
        id: i + 1,
        name: original[0] + (volume > 1 ? " - Volume " + volume : ""),
        author: original[1],
        category: original[2],
        price: original[3] + (volume - 1) * 10,
        image: imageList[i % imageList.length],
        description: "Discover " + original[0] +
            ". Explore interesting ideas, knowledge and stories in this book."
    });
}

const booksPerPage = 20;
let currentPage = 1;
let filteredBooks = [...books];
let cart = [];

const bookContainer = document.getElementById("bookContainer");

function displayBooks() {
    const start = (currentPage - 1) * booksPerPage;
    const end = start + booksPerPage;
    const pageBooks = filteredBooks.slice(start, end);

    bookContainer.innerHTML = "";

    if (pageBooks.length === 0) {
        bookContainer.innerHTML = "<p>No books found.</p>";
    }

    pageBooks.forEach(book => {
        bookContainer.innerHTML += `
            <div class="book-card">
                <img
                    class="book-cover"
                    src="${book.image}"
                    alt="${book.name}"
                    loading="lazy"
                >
                <h3>${book.name}</h3>
                <p>✍️ ${book.author}</p>
                <p>📚 ${book.category}</p>
                <h3>₹${book.price}</h3>
                <button onclick="openBook(${book.id})">Read Book</button>
                <button onclick="addToCart(${book.id})">Add to Cart</button>
            </div>
        `;
    });

    document.getElementById("resultCount").textContent =
        "Showing " + pageBooks.length + " of " + filteredBooks.length + " books";

    updatePagination();
}

function filterBooks() {
    const search = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;

    filteredBooks = books.filter(book => {
        const matchesSearch =
            book.name.toLowerCase().includes(search) ||
            book.author.toLowerCase().includes(search);

        const matchesCategory =
            category === "All" || book.category === category;

        return matchesSearch && matchesCategory;
    });

    currentPage = 1;
    displayBooks();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const pageNumbers = document.getElementById("pageNumbers");

    pageNumbers.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;

        if (i === currentPage) {
            button.classList.add("active");
        }

        button.onclick = () => goToPage(i);
        pageNumbers.appendChild(button);
    }

    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled =
        currentPage === totalPages || totalPages === 0;

    document.getElementById("pageInfo").textContent =
        "Page " + (totalPages ? currentPage : 0) + " of " + totalPages;
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    if (page < 1 || page > totalPages) return;

    currentPage = page;
    displayBooks();

    document.getElementById("books").scrollIntoView({
        behavior: "smooth"
    });
}

function changePage(direction) {
    goToPage(currentPage + direction);
}

function openBook(id) {
    const book = books.find(item => item.id === id);

    document.getElementById("readerDetails").innerHTML = `
        <h2>${book.name}</h2>
        <img class="reader-image" src="${book.image}" alt="${book.name}">
        <p><b>Author:</b> ${book.author}</p>
        <p><b>Category:</b> ${book.category}</p>
        <p><b>Price:</b> ₹${book.price}</p>
        <p>${book.description}</p>
        <p><b>Note:</b> This is a sample book description, not the complete book text.</p>
        <button class="main-btn" onclick="addToCart(${book.id})">
            Add to Cart
        </button>
    `;

    showModal("readerModal");
}

function addToCart(id) {
    const book = books.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...book, quantity: 1 });
    }

    updateCart();
    alert(book.name + " added to cart!");
}

function updateCart() {
    document.getElementById("cartCount").textContent =
        cart.reduce((sum, item) => sum + item.quantity, 0);

    document.getElementById("cartItems").innerHTML = cart.length
        ? cart.map(item => `
            <div class="cart-row">
                <span>${item.name} × ${item.quantity}</span>
                <span>₹${item.price * item.quantity}</span>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join("")
        : "<p>Your cart is empty.</p>";

    document.getElementById("cartTotal").textContent = getSubtotal();
}

function getSubtotal() {
    return cart.reduce((sum, item) =>
        sum + item.price * item.quantity, 0);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function openCart() {
    updateCart();
    showModal("cartModal");
}

function openBilling() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    closeModal("cartModal");

    const subtotal = getSubtotal();
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    document.getElementById("billingSummary").innerHTML = `
        <p>Subtotal: ₹${subtotal.toFixed(2)}</p>
        <p>GST (18% demo calculation): ₹${gst.toFixed(2)}</p>
        <h3>Total: ₹${total.toFixed(2)}</h3>
    `;

    showModal("billingModal");
}

document.getElementById("billingForm").addEventListener("submit", function(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const name = document.getElementById("customerName").value;
    const phone = document.getElementById("customerPhone").value;
    const address = document.getElementById("customerAddress").value;

    const subtotal = getSubtotal();
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    const invoiceNumber = "GB" + Date.now();

    document.getElementById("invoiceDetails").innerHTML = `
        <h1>📚 GlassBook Invoice</h1>
        <hr>
        <p><b>Invoice No:</b> ${invoiceNumber}</p>
        <p><b>Customer:</b> ${escapeHTML(name)}</p>
        <p><b>Phone:</b> ${escapeHTML(phone)}</p>
        <p><b>Address:</b> ${escapeHTML(address)}</p>
        <hr>
        <h3>Purchased Books</h3>
        ${cart.map(item => `
            <p>${escapeHTML(item.name)} × ${item.quantity}
            - ₹${(item.price * item.quantity).toFixed(2)}</p>
        `).join("")}
        <hr>
        <p>Subtotal: ₹${subtotal.toFixed(2)}</p>
        <p>GST (18% demo calculation): ₹${gst.toFixed(2)}</p>
        <h2>Total: ₹${total.toFixed(2)}</h2>
        <p>Payment status: Not paid (demo invoice)</p>
        <p>Thank you for shopping with GlassBook!</p>
    `;

    closeModal("billingModal");
    showModal("invoiceModal");

    cart = [];
    updateCart();
    document.getElementById("billingForm").reset();
});

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function showModal(id) {
    document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

window.addEventListener("click", function(event) {
    document.querySelectorAll(".modal").forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

displayBooks();
updateCart();
