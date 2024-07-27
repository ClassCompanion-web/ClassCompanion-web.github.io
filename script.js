// Function to check if "username" is in localStorage and redirect if not
function checkLogin() {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = '/login';
    }
}

// Call the function on page load
checkLogin();
