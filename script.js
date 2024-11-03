// Your Firebase configuration here
const firebaseConfig = {
    apiKey: "AIzaSyB3oeinjPyPKJENVhJiNVe7L4wd5jrJAjk",
    authDomain: "mod-guide-5dc1f.firebaseapp.com",
    projectId: "mod-guide-5dc1f",
    storageBucket: "mod-guide-5dc1f.firebasestorage.app",
    messagingSenderId: "796089402927",
    appId: "1:796089402927:web:d16876b4ce4c5fd5b768da",
    measurementId: "G-Z6MWNVWX72"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Event listener for the form submission
document.getElementById('page-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const category = document.getElementById('category').value;
    const subcategory = document.getElementById('subcategory').value || null; // Default to null
    const content = document.getElementById('content').value;
    addPage(title, author, category, subcategory, content); // Pass sub-category to addPage
});

// Function to add a page to Firestore
function addPage(title, author, category, subcategory, content) {
    db.collection("pages").add({
        title: title,
        author: author,
        category: category,
        subcategory: subcategory, // Save as null if not provided
        content: content,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        modified: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        document.getElementById('page-form').reset();
        loadPages(); // Refresh the page list
    }).catch(error => {
        console.error("Error adding document: ", error);
    });
}

// Function to load pages from Firestore
function loadPages() {
    const pagesList = document.getElementById('pages-list');
    pagesList.innerHTML = ''; // Clear the list before loading
    db.collection("pages").get().then((querySnapshot) => {
        const categories = {};

        // Group pages by category and sub-category
        querySnapshot.forEach((doc) => {
            const page = doc.data();
            const createdAt = page.created ? page.created.toDate().toLocaleString() : "Unknown";
            const catKey = page.category + (page.subcategory ? `|${page.subcategory}` : ''); // Unique key for category and sub-category
            
            if (!categories[catKey]) {
                categories[catKey] = [];
            }
            categories[catKey].push({
                id: doc.id,
                title: page.title,
                author: page.author,
                createdAt: createdAt
            });
        });

        // Render categories and pages
        for (const catKey in categories) {
            const [category, subcategory] = catKey.split('|'); // Split category and sub-category
            pagesList.innerHTML += `
                <div class="category">
                    <h3 class="category-title" onclick="toggleCategory('${category}', this)">
                        ${category} <span class="arrow" id="${category}-arrow">▶</span> 
                    </h3>
                    <div class="subcategories" id="${category}-subcategories" style="display: none;">
                        ${subcategory ? `
                            <h4 class="subcategory-title" onclick="toggleSubcategory('${category}-${subcategory}', this)">
                                ${subcategory} <span class="arrow" id="${category}-${subcategory}-arrow">▶</span> 
                            </h4>
                            <div class="pages" id="${category}-${subcategory}-pages" style="display: none;">
                                ${categories[catKey].map(page => `
                                    <div class="page" onclick="goToPage('${page.id}')">
                                        <h4>${page.title}</h4>
                                        <p><strong>Author:</strong> ${page.author}</p>
                                        <p><strong>Created:</strong> ${page.createdAt}</p>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    }).catch(error => {
        console.error("Error loading pages: ", error);
    });
}

// Function to toggle the visibility of subcategories
function toggleSubcategory(subcatKey, element) {
    const pagesDiv = document.getElementById(`${subcatKey}-pages`);
    const arrow = document.getElementById(`${subcatKey}-arrow`);
    const isExpanded = pagesDiv.style.display === 'block';
    
    pagesDiv.style.display = isExpanded ? 'none' : 'block';
    arrow.innerHTML = isExpanded ? '▶' : '▼'; // Change arrow direction
}

// Function to toggle the visibility of categories
function toggleCategory(category, element) {
    const subcategoriesDiv = document.getElementById(`${category}-subcategories`);
    const arrow = document.getElementById(`${category}-arrow`);
    const isExpanded = subcategoriesDiv.style.display === 'block';
    
    subcategoriesDiv.style.display = isExpanded ? 'none' : 'block';
    arrow.innerHTML = isExpanded ? '▶' : '▼'; // Change arrow direction
}

// Function to navigate to the detailed page
function goToPage(id) {
    localStorage.setItem("currentPageId", id);
    window.location.href = "page.html"; // Redirect to detail page
}

// Load pages on initial load
loadPages();
