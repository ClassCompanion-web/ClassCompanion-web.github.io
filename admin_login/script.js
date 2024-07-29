// Function to handle admin login
window.adminLogin = async function(event) {
    event.preventDefault();

    const password = document.getElementById('adminPassword').value;
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    const adminHash = 'b2c34f65747a5789d825247a8cd1fa116fa56ffaf58683fa640e5693e547ed83';
    const volunteerHash = '0e3e815ab5f1b3bece555b81dde7c3f93b212a1feea22121fcc408cd37558dae';

    if (hashedPassword === adminHash) {
        localStorage.setItem('role', 'admin');
        window.location.href = '/admin/index.html';
    } else if (hashedPassword === volunteerHash) {
        localStorage.setItem('role', 'volunteer');
        window.location.href = '/admin/index.html';
    } else {
        alert('Invalid password!');
    }
}

// Check if the user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const role = localStorage.getItem('role');
    if (role) {
        window.location.href = '/admin/index.html';
    }
});
