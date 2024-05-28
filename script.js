const apiUrl = 'http://localhost:3000';

async function register() {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const role = document.getElementById('register-role').value;

  try {
    const response = await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, role })
    });

    if (response.ok) {
      alert('User registered successfully!');
    } else {
      alert('Registration failed!');
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
}

async function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      showUserPanel();
    } else {
      alert('Login failed!');
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
}

async function createText() {
  const content = document.getElementById('text-content').value;
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${apiUrl}/texts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ content })
    });

    if (response.ok) {
      alert('Text created successfully!');
      getTexts();
    } else {
      alert('Text creation failed!');
    }
  } catch (error) {
    console.error('Text creation failed:', error);
  }
}

async function getTexts() {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${apiUrl}/texts`, {
      headers: {
        'Authorization': token
      }
    });

    const texts = await response.json();
    displayTexts(texts);
  } catch (error) {
    console.error('Failed to fetch texts:', error);
  }
}

function displayTexts(texts) {
  const textsDiv = document.getElementById('texts');
  textsDiv.innerHTML = '';

  texts.forEach(text => {
    const textDiv = document.createElement('div');
    textDiv.textContent = `${text.content} (Created by: ${text.createdBy.username})`;

    // Add delete and update buttons if the user is the creator
    if (text.createdBy._id === getCurrentUserId()) {
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteText(text._id);

      const updateButton = document.createElement('button');
      updateButton.textContent = 'Update';
      updateButton.onclick = () => updateText(text._id);

      textDiv.appendChild(deleteButton);
      textDiv.appendChild(updateButton);
    }

    textsDiv.appendChild(textDiv);
  });
}

async function deleteText(textId) {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${apiUrl}/texts/${textId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token
      }
    });

    if (response.ok) {
      alert('Text deleted successfully!');
      getTexts();
    } else {
      alert('Text deletion failed!');
    }
  } catch (error) {
    console.error('Text deletion failed:', error);
  }
}

async function updateText(textId) {
  const newContent = prompt('Enter new content:');
  if (!newContent) return;

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${apiUrl}/texts/${textId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ content: newContent })
    });

    if (response.ok) {
      alert('Text updated successfully!');
      getTexts();
    } else {
      alert('Text update failed!');
    }
  } catch (error) {
    console.error('Text update failed:', error);
  }
}

function showUserPanel() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = parseJwt(token);
    if (decodedToken.role === 'seller') {
      document.getElementById('auth').style.display = 'none';
      document.getElementById('seller-panel').style.display = 'block';
      getTexts();
    } else {
      document.getElementById('auth').style.display = 'none';
      document.getElementById('buyer-panel').style.display = 'block';
      getTexts();
    }
  }
}

function getCurrentUserId() {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = parseJwt(token);
    return decodedToken.id;
  }
  return null;
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

// Call this function to show the user panel if a token is already stored
// showUserPanel();
