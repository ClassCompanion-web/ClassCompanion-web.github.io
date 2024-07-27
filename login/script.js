// Check if the user is logged in
function checkLoginStatus() {
    const username = localStorage.getItem('username');

    // If a username is found in local storage, redirect to homepage
    if (username) {
        window.location.href = '/';
    }
}

// Execute the check when the page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);

// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, getDoc, doc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Your web app's Firebase configuration
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

function togglePassword(fieldId, toggleId) {
    const passwordField = document.getElementById(fieldId);
    const toggleIcon = document.getElementById(toggleId);
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleIcon.textContent = '🔒';
    } else {
        passwordField.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}

async function submitLoginForm(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Hash the password using SHA256
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

    try {
        const userDoc = doc(db, 'users', fullName);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            if (userData.password === hashedPassword) {
                localStorage.setItem('username', fullName);
                window.location.href = '/';
            } else {
                errorMessage.textContent = 'Incorrect password';
            }
        } else {
            errorMessage.textContent = 'User not found';
        }
    } catch (error) {
        console.error('Error logging in: ', error);
        errorMessage.textContent = 'Error logging in, please try again';
    }
}

// Expose the function to global scope if needed
window.submitLoginForm = submitLoginForm;
window.togglePassword = togglePassword;
