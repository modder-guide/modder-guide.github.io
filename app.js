// Import necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth, GithubAuthProvider, onAuthStateChanged, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, orderBy, query } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// GitHub Login
document.getElementById('login-button').onclick = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            console.log(`User signed in: ${user.displayName}`);
            document.getElementById('user-info').innerText = `Welcome, ${user.displayName}`;
            document.getElementById('create-category').style.display = 'block'; // Show create category button
            document.getElementById('create-wiki-page-sidebar').style.display = 'block'; // Show create wiki page button
        })
        .catch((error) => {
            console.error('Error during sign-in:', error);
        });
};

// Handle authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('user-info').innerText = `Welcome, ${user.displayName}`;
        document.getElementById('post-comment').style.display = 'block'; // Show post comment button
    } else {
        document.getElementById('user-info').innerText = 'Please log in.';
        document.getElementById('post-comment').style.display = 'none'; // Hide post comment button
    }
});

// Create a new wiki page
document.getElementById('create-wiki-page').onclick = async () => {
    const title = document.getElementById('wiki-title').value;
    const content = document.getElementById('wiki-content').value;
    const css = document.getElementById('wiki-css').value;
    
    if (title && content) {
        try {
            await addDoc(collection(db, 'wikiPages'), {
                title: title,
                content: content,
                css: css,
                author: auth.currentUser.displayName,
                createdAt: new Date() // Use a date object for createdAt
            });
            console.log('Wiki page created!');
            document.getElementById('wiki-title').value = ''; // Reset the title
            document.getElementById('wiki-content').value = ''; // Reset the content
            document.getElementById('wiki-css').value = ''; // Reset custom CSS
        } catch (error) {
            console.error('Error adding wiki page:', error);
        }
    } else {
        alert('Please provide a title and content for the wiki page.');
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
            listItem.innerHTML = `<h3>${data.title} <span>▼</span></h3>`;
            wikiList.appendChild(listItem);
        });
    });
};

// Call the function to fetch wiki pages when the script loads
fetchWikiPages();
