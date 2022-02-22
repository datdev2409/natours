/* eslint-disable no-undef */
async function logout() {
  try {
    const data = await (await fetch('/api/v1/auth/logout')).json();
    console.log(data);
    if (data.status === 'success') {
      location.assign('/');
      // location.reload(true);
    }
  } catch (error) {
    console.log('Something went wrong');
  }
}

export default logout;
