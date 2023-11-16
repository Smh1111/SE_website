document.addEventListener("DOMContentLoaded", function () {
      // Get the form and input elements
      const loginForm = document.getElementById('login');
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
  
      // Add event listener to the form
      loginForm.addEventListener('click', function (event) {
          event.preventDefault(); // Prevent the form from submitting
  
          // Get the values from the input fields
          const email = emailInput.value.trim();
          const password = passwordInput.value.trim();
  
          // Hardcoded fake data for demonstration
          const fakeEmail = 'demo@example.com';
          const fakePassword = 'password123';
  
          // Perform validation with fake data
          if (email === fakeEmail && password === fakePassword) {
              alert('Login successful!');
              
              // Redirect to another HTML file (replace 'dashboard.html' with your desired file)
                window.location.href = 'BlogEditor.html';
                
          } else {
              alert('Invalid email or password. Please try again.');
          }
      });
  });
  