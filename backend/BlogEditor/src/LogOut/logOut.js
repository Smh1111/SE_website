
    // Function to handle logout
    function logout() {
        // Display a confirmation dialog
        var confirmLogout = window.confirm("Are you sure you want to log out?");
        
        // If the user clicks OK in the confirmation dialog, proceed with logout
        if (confirmLogout) {
            // Perform logout actions here, such as clearing session data, redirecting, etc.
            console.log("Logging out...");

            // Redirect to the login page
            window.location.href = 'login.html';
        }
    }

    // Add click event to the logout button
    document.getElementById('logoutButton').addEventListener('click', function(event) {
        // Prevent the default link behavior
        event.preventDefault();

        // Call the logout function when the button is clicked
        logout();
    });
