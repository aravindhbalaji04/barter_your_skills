document.getElementById('signupForm').onsubmit = function(e) {
    e.preventDefault();
    var name = document.getElementById('name').value;
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var profession = document.getElementById('profession').value;
    var skillset = document.getElementById('skillset').value;
    var preferences = Array.from(document.getElementById('preference').selectedOptions).map(opt => opt.value);
    var users = JSON.parse(localStorage.getItem('users') || '[]');
    // Prevent duplicate username or email
    if(users.some(u => u.username === username || u.email === email)) {
        document.getElementById('signupError').innerText = 'Username or email already exists.';
        return;
    }
    users.push({ name, username, email, password, profession, skillset, preferences });
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('signupError').style.color = 'green';
    document.getElementById('signupError').innerText = 'Signup successful! You can now log in.';
    document.getElementById('signupForm').reset();
};

function handleGoogleSignIn(response) {
    // In a real app, send response.credential to backend for verification
    alert('Google Sign-In successful! (Implement backend logic)');
    // For demo, just redirect
    window.location.href = 'nextpage.html';
}