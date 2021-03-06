/* eslint-disable no-undef */
import '@babel/polyfill';
import { login } from './login';
import logout from './logout';
import createAlert from './alert';
import { updateMe, updatePassword } from './updateme';

const $ = document.querySelector.bind(document);

if ($('.login-form')) {
  console.log($('.login-form'));
  $('.login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = $('#email').value;
    const password = $('#password').value;

    console.log(email);

    await login(email, password);
  });
}

if ($('#logout')) {
  $('#logout').addEventListener('click', logout);
}

const infoForm = $('.form-user-data');
const passwordForm = $('.form-user-settings');

if (infoForm) {
  infoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(infoForm);
    const result = await updateMe(formData);

    if (result.status === 'success') {
      createAlert('success', 'Change successfully!!');
      setTimeout(() => {
        location.reload();
      }, 500);
    }
  });
}

if (passwordForm) {
  passwordForm.addEventListener('submit', async (e) => {
    $('.btn--save-password').textContent = 'Updating..';
    e.preventDefault();
    try {
      const password = $('#password-current').value;
      const newPassword = $('#password').value;
      const confirmPassword = $('#password-confirm').value;
      const result = await updatePassword(
        password,
        newPassword,
        confirmPassword
      );

      $('.btn--save-password').textContent = 'Save password';
      if (result.status === 'success') {
        location.assign('/login');
      } else {
        createAlert('error', 'Change password failed, try again');
      }
    } catch (error) {
      console.error(error);
    }
  });
}
