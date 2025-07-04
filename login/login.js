document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    var user = document.getElementById('user').value;
    var pass = document.getElementById('password').value;
    // Check localStorage for registered users
    var users = JSON.parse(localStorage.getItem('users') || '[]');
    var found = users.find(u => (u.username === user || u.email === user) && u.password === pass);
    if(found) {
        // Save the logged-in user index to localStorage for profile display
        localStorage.setItem('loggedInUserIndex', users.indexOf(found));
        window.location.href = 'profile.html';
    } else {
        document.getElementById('loginError').innerText = 'Invalid credentials.';
    }
};

function handleGoogleSignIn(response) {
    // In a real app, send response.credential to backend for verification
    alert('Google Sign-In successful! (Implement backend logic)');
    // For demo, just redirect
    window.location.href = 'profile.html';
}