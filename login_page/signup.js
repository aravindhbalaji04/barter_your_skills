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
  const skillsetInput = document.getElementById('skillset').value;
  const servicesInput = document.getElementById('services').value;
  const skill_set = skillsetInput.split(',').map(s => s.trim()).filter(Boolean);
  const services_provided = servicesInput.split(',').map(s => s.trim()).filter(Boolean);

  // Step 1: Sign up
  const { data: signupData, error: signupError } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (signupError) {
    document.getElementById('error').innerText = signupError.message;
    return;
  }

  const user = signupData.user;

  console.log("User ID:", user?.id);
console.log("Skill Set:", skill_set);
console.log("Services Provided:", services_provided);


  if (!user) {
    document.getElementById('error').innerText = "Signup succeeded, but no user returned. Please try logging in.";
    return;
  }

  // Step 2: Insert user profile
  const { error: insertError } = await supabaseClient.from('profiles').insert([
    {
      id: user.id,
      name,
      username,
      email,
      contact_no: contact,
      location,
      skill_set,
      services_provided
    }
  ]);

  if (insertError) {
    document.getElementById('error').innerText = insertError.message;
    return;
  }

  alert('Signup successful!');
  window.location.href = 'index.html';
});
