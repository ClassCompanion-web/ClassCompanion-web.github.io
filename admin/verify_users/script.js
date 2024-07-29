// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, getDocs, updateDoc, doc, query, where } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

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

// Function to handle admin logout
window.adminLogout = function() {
    localStorage.removeItem('role');
    alert('Logged out successfully!');
    window.location.href = '/admin_login'; // Redirect to the login page
}

// Function to fetch and display unverified users
async function fetchUnverifiedUsers() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = ''; // Clear the list

    const q = query(collection(db, 'users'), where('verification_pending', '==', true));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');
        userCard.innerHTML = `
            <div class="user-info">
                <h2>${userData.fullName}</h2>
                <p>Phone: ${userData.phone}</p>
                <p>Email: ${userData.email}</p>
            </div>
            <button onclick="verifyUser('${doc.id}')">Verify User</button>
        `;
        userList.appendChild(userCard);
    });
}

// Function to verify user
window.verifyUser = async function(userId) {
    try {
        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, {
            verification_pending: false
        });
        alert('User verified successfully!');
        fetchUnverifiedUsers(); // Refresh the list
    } catch (error) {
        console.error('Error verifying user:', error);
        alert('Error verifying user, please try again.');
    }
}

// Check if the user is logged in and has the appropriate role
document.addEventListener('DOMContentLoaded', function() {
    const role = localStorage.getItem('role');

    if (role !== 'admin') {
        alert('Access denied!');
        window.location.href = '/admin_login'; // Redirect to the login page if not authorized
    } else {
        fetchUnverifiedUsers(); // Fetch and display unverified users
    }
});
