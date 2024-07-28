// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, getDoc, doc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB3yM94XYInt9mMMIlh-L_0yOP_oOZ8HKg",
    authDomain: "class-companion-platform.firebaseapp.com",
    projectId: "class-companion-platform",
    storageBucket: "class-companion-platform.appspot.com",
    messagingSenderId: "750536088298",
    appId: "1:750536088298:web:5a2e35a04b0888f7561593",
    measurementId: "G-WQRDHBV9M2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Check if the user is verified
async function checkVerificationStatus() {
    const username = localStorage.getItem('username');

    if (username) {
        try {
            const userDoc = doc(db, 'users', username);
            const userSnap = await getDoc(userDoc);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                if (userData.verification_pending) {
                }
                else {
                    window.location.href = '/'
                }
            } else {
                console.error('No such document!');
            }
        } catch (error) {
            console.error('Error getting document:', error);
        }
    } else {
        // If not logged in, redirect to login page
        window.location.href = '/login';
    }
}

// Execute the check when the page loads
document.addEventListener('DOMContentLoaded', checkVerificationStatus);
