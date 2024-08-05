import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

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

// Check if the user has admin access
document.addEventListener('DOMContentLoaded', function() {
    const role = localStorage.getItem('role');

    if (role !== 'admin') {
        alert('Access denied!');
        window.location.href = '/admin'; // Redirect to the login page if not authorized
    }
});

// Handle form submission
document.getElementById('addSchoolForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const schoolName = document.getElementById('schoolName').value;
    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;

    try {
        const schoolRef = doc(db, 'schools', schoolName);
        await setDoc(schoolRef, { country, city });
        await setDoc(doc(schoolRef, 'classes', 'placeholder'), { initialized: true });

        alert('School added successfully!');
        document.getElementById('addSchoolForm').reset();
    } catch (error) {
        console.error('Error adding school:', error);
        alert('Error adding school, please try again.');
    }
});
