const loginForm = document.querySelector('.login-form')
const emailField = document.querySelector('#email')
const passwordField = document.querySelector('#password')

async function login() {
  const user = {
    email: emailField.value,
    password: passwordField.value
  }

  try {
    const data = await (await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })).json()

    if (data.status === 'fail') {
      alert('Login Failed')
    }
    else {
      location.assign('/')
    }
  }
  catch (error) {
    console.log('Something went wrong')
  }
}

loginForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  await login();
})