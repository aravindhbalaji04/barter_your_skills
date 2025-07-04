// 1. Get the function from the global Supabase module (already loaded via CDN)
const { createClient } = supabase;

// 2. Create a Supabase client instance
const supabaseClient = createClient('https://uyifmxtmfqlojodlrmzu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5aWZteHRtZnFsb2pvZGxybXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1OTkzOTYsImV4cCI6MjA2NzE3NTM5Nn0.flAP_CN8tbXFLlIYJ6QkZapHC_ceqgnAb7XEIJ0IkyY');

document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const contact = document.getElementById('contact').value;
  const location = document.getElementById('location').value;

  // 1. Sign up the user
  const { data: signupData, error: signupError } = await supabaseClient.auth.signUp({
  email,
  password,
});

if (signupError) {
  document.getElementById('error').innerText = signupError.message;
  return;
}

// Step 2: Sign in to get session
const { data: loginData, error: loginError } = await supabaseClient.auth.signInWithPassword({
  email,
  password,
});

if (loginError) {
  document.getElementById('error').innerText = loginError.message;
  return;
}

// Step 3: Insert profile
const { user } = loginData;
const { error: insertError } = await supabaseClient.from('profiles').insert([
  {
    id: user.id,
    name,
    username,
    email,
    contact_no: contact,
    location,
  }
]);

  if (insertError) {
    document.getElementById('error').innerText = insertError.message;
    return;
  }

  alert('Signup successful! Please check your email to confirm.');
  window.location.href = 'index.html';
});

