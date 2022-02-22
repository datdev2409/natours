import createAlert from './alert';

export async function login(email, password) {
  try {
    const data = await (
      await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
    ).json();

    if (data.status === 'success') {
      createAlert('success', 'Login successfully!!');
      setTimeout(() => {
        location.assign('/');
      }, 1000);
    } else {
      createAlert('error', data.message);
      // console.log(data);
    }
  } catch (error) {
    console.log('Something went wrong');
  }
}
