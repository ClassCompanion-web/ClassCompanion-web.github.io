// Function to navigate to a page
window.navigateTo = function(page) {
    window.location.href = `/admin/${page}`;
}

// Function to handle admin logout
window.adminLogout = function() {
    localStorage.removeItem('role');
    alert('Logged out successfully!');
    window.location.href = '/admin_login'; // Redirect to the login page
}

// Check if the user is logged in and has the appropriate role
document.addEventListener('DOMContentLoaded', function() {
    const role = localStorage.getItem('role');
    const verifyUsersButton = document.getElementById('verify-users-button');
    const addSchoolButton = document.getElementById('add-school-button');
    const addClassButton = document.getElementById('add-class-button');

    if (role === 'admin') {
        verifyUsersButton.disabled = false;
        verifyUsersButton.removeAttribute('data-hover');
        addSchoolButton.disabled = false;
        addSchoolButton.removeAttribute('data-hover');
        addClassButton.disabled = false;
        addClassButton.removeAttribute('data-hover');
    } else if (role === 'volunteer') {
        verifyUsersButton.disabled = true;
        verifyUsersButton.setAttribute('data-hover', 'You don\'t have access to this');
        addSchoolButton.disabled = true;
        addSchoolButton.setAttribute('data-hover', 'You don\'t have access to this');
        addClassButton.disabled = true;
        addClassButton.setAttribute('data-hover', 'You don\'t have access to this');

    } else {
        alert('Access denied!');
        window.location.href = '/admin_login'; // Redirect to the login page if not authorized
    }
});
