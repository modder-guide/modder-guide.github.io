// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, onSnapshot, orderBy, query, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDaFNiGCH8D-0rnmXAH9PoJRkJQk42WDM4",
    authDomain: "modder-wiki.firebaseapp.com",
    projectId: "modder-wiki",
    storageBucket: "modder-wiki.appspot.com",
    messagingSenderId: "563119242271",
    appId: "1:563119242271:web:3fce73d1284124dc1a692a",
    measurementId: "G-5ME15EMK89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Fetch categories from Firestore and populate the category dropdown
const fetchCategories = async () => {
    const categorySelect = document.getElementById('wiki-category');
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    categoriesSnapshot.forEach(doc => {
        const option = document.createElement('option');
        option.value = doc.id; // or option.value = doc.data().name if you have a name field
        option.textContent = doc.data().name; // Assuming each category document has a 'name' field
        categorySelect.appendChild(option);
    });
};

// Create a new wiki page
document.getElementById('create-wiki-page').onclick = async () => {
    const title = document.getElementById('wiki-title').value;
    const content = document.getElementById('editor').value;
    const author = document.getElementById('wiki-author').value;
    const category = document.getElementById('wiki-category').value;

    if (title && content && author && category) {
        try {
            await addDoc(collection(db, 'wikiPages'), {
                title: title,
                content: content,
                author: author,
                category: category, // Store the selected category
                createdAt: new Date() // Use a date object for createdAt
            });
            console.log('Wiki page created!');
            document.getElementById('wiki-title').value = ''; // Reset the title
            document.getElementById('editor').value = ''; // Reset the content
            document.getElementById('wiki-author').value = ''; // Reset the author
            document.getElementById('wiki-category').value = ''; // Reset the category
        } catch (error) {
            console.error('Error adding wiki page:', error);
        }
    } else {
        alert('Please provide a title, content, author, and select a category for the wiki page.');
    }
};

// Fetch and display wiki pages
const fetchWikiPages = () => {
    const q = query(collection(db, 'wikiPages'), orderBy('createdAt'));
    onSnapshot(q, (snapshot) => {
        const wikiList = document.getElementById('category-list');
        wikiList.innerHTML = ''; // Clear the list before adding new items
        snapshot.forEach(doc => {
            const data = doc.data();
            const listItem = document.createElement('div');
            listItem.className = 'category';
            listItem.innerHTML = `
                <h3>${data.title} <span>▼</span></h3>
                <p><strong>Author:</strong> ${data.author}</p>
                <p><strong>Category:</strong> ${data.category}</p>
                <div class="wiki-content">${data.content}</div>
            `;
            wikiList.appendChild(listItem);
        });
    });
};

// Call the functions to fetch categories and wiki pages when the script loads
fetchCategories();
fetchWikiPages();
