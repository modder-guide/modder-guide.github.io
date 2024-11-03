// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaFNiGCH8D-0rnmXAH9PoJRkJQk42WDM4",
  authDomain: "modder-wiki.firebaseapp.com",
  projectId: "modder-wiki",
  storageBucket: "modder-wiki.appspot.com", // Make sure this is correct
  messagingSenderId: "563119242271",
  appId: "1:563119242271:web:3fce73d1284124dc1a692a",
  measurementId: "G-5ME15EMK89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Handle form submission
document.getElementById('wikiForm').addEventListener('submit', submitForm);

async function submitForm(e) {
    e.preventDefault(); // Prevent default form submission behavior

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    try {
        // Add a new document with a generated ID
        await addDoc(collection(db, 'pages'), {
            title: title,
            content: content,
            timestamp: new Date()
        });
        console.log("Page added!");
        document.getElementById('wikiForm').reset(); // Reset form after submission
    } catch (error) {
        console.error("Error adding page: ", error);
    }
}

// Fetch and display pages
onSnapshot(collection(db, 'pages'), (snapshot) => {
    const pageList = document.getElementById('pageList');
    pageList.innerHTML = ''; // Clear the list first

    snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement('li');
        li.textContent = `${data.title}: ${data.content}`;
        pageList.appendChild(li);
    });
});
