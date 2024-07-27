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
import { getFirestore, collection, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

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

async function submitForm(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const schoolName = document.getElementById('schoolName').value;
    const classValue = document.getElementById('class').value;
    const section = document.getElementById('section').value;
    const errorMessage = document.getElementById('errorMessage');

    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match';
        return;
    }

    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);

    try {
        await setDoc(doc(db, 'users', fullName), {
            fullName: fullName,
            password: hashedPassword,
            email: email,
            phone: phone,
            schoolName: schoolName,
            class: parseInt(classValue, 10),
            section: section,
            verification_pending: true
        });
        alert('Signup successful!');
        document.getElementById('signupForm').reset();
        errorMessage.textContent = '';
        window.location.href = '/login';
    } catch (error) {
        console.error('Error adding document: ', error);
        errorMessage.textContent = 'Error signing up, please try again';
    }
}

// Expose the function to global scope if needed
window.submitForm = submitForm;
window.togglePassword = togglePassword;
