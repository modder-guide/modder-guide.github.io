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

function goBack() {
    window.history.back(); // Go back to the previous page
}

window.onload = function() {
    const pageId = localStorage.getItem("currentPageId");
    if (pageId) {
        db.collection("pages").doc(pageId).get().then((doc) => {
            if (doc.exists) {
                const page = doc.data();
                const createdAt = page.created ? page.created.toDate().toLocaleString() : "Unknown";
                const modifiedAt = page.modified ? page.modified.toDate().toLocaleString() : "Unknown";

                // Set the document title to the title of the page
                document.title = page.title;

                // Format content for code blocks
                const formattedContent = formatContent(page.content);

                document.getElementById('detail-content').innerHTML = `
                    <h2>${page.title}</h2>
                    <p><strong>By:</strong> ${page.author}</p><p>                              ${createdAt}</p>
                    <div style="container2">
                    <pre>${formattedContent}</pre>
                    </div>
                `;
            } else {
                document.getElementById('detail-content').innerHTML = "<p>Page not found!</p>";
            }
        }).catch((error) => {
            console.error("Error fetching page: ", error);
            document.getElementById('detail-content').innerHTML = "<p>Error loading page!</p>";
        });
    } else {
        document.getElementById('detail-content').innerHTML = "<p>No page selected!</p>";
    }
};

// Function to format content, turning text wrapped in ``` into a code block
function formatContent(content) {
    // Use regex to replace code blocks with <code> tags
    return content.replace(/```([^`]+)```/g, (match, code) => {
        return `<code>${code.trim()}</code>`;
    });
}
