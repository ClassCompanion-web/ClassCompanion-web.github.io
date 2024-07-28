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

// Admin password hash
const adminPasswordHash = 'b2c34f65747a5789d825247a8cd1fa116fa56ffaf58683fa640e5693e547ed83';

// Function to hash a string with SHA-256
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Admin login function
window.adminLogin = async function() {
    const password = document.getElementById('admin-password').value;
    const hashedPassword = await sha256(password);

    if (hashedPassword === adminPasswordHash) {
        localStorage.setItem('admin', '1');
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('user-container').style.display = 'block';
        fetchUnverifiedUsers();
    } else {
        alert('Incorrect password.');
    }
}

// Fetch and display unverified users
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

// Verify user
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

// Check if admin is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('admin') === '1') {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('user-container').style.display = 'block';
        fetchUnverifiedUsers();
    }
});
