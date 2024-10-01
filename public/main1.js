document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://sibidashboard2.azurewebsites.net/api';

    // Register Form Submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;

            try {
                const response = await fetch(`${apiUrl}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await response.json();
                alert(data.message);

                // Reset form after successful registration
                 if (response.ok) {
                    registerForm.reset(); // Reset form fields
                }
            } catch (error) {
                console.error('Error registering user:', error);
                alert('Failed to register user');
            }
        });
    } else {
        console.error('registerForm element not found');
    }

    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch(`${apiUrl}/login`, {
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
    } else {
        console.error('loginForm element not found');
    }

    // Upload Form Submission
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];

            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`${apiUrl}/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload file');
                }

                const data = await response.json();
                alert(data.message);
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('Failed to upload file');
            }
        });
    } else {
        console.error('uploadForm element not found');
    }

    // Admin Dashboard
    const fileList = document.getElementById('fileList');
    if (fileList) {
        fetch(`${apiUrl}/admin/files`)
            .then(response => response.json())
            .then(files => {
                fileList.innerHTML = '';
                files.forEach(file => {
                    const li = document.createElement('li');
                    li.textContent = file;
                    fileList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error fetching files:', error);
                alert('Failed to fetch files');
            });
    }

    // Logout Function
    function logout() {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }

    // Logout Button Click Event
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    } else {
        console.error('logoutButton element not found');
    }

    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back();
        });
    } else {
        console.error('backButton element not found');
    }
});
