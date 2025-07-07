const { createClient } = supabase;

// 2. Create a Supabase client instance
const supabaseClient = createClient('https://uyifmxtmfqlojodlrmzu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5aWZteHRtZnFsb2pvZGxybXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1OTkzOTYsImV4cCI6MjA2NzE3NTM5Nn0.flAP_CN8tbXFLlIYJ6QkZapHC_ceqgnAb7XEIJ0IkyY');



document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    document.getElementById('error').innerText = error.message;
  } else {
    alert('Login successful!');
    window.location.href = '/feed/feed.html';

  }
});
