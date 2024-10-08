const apiUrl = 'https://sibidashboard2.azurewebsites.net/api';

// Register Form Submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`https://sibidashboard2.azurewebsites.net/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Error registering user:', error);
        alert('Failed to register user');
    }
    
});

// Login Form Submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`https://sibidashboard2.azurewebsites.net/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            window.location.href = 'profile.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Failed to login');
    }
});
