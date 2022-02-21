const $ = document.querySelector.bind(document);

const infoForm = $('.form-user-data');
const passwordForm = $('.form-user-settings');

const updateMe = async (name, email) => {
  const data = { name, email };
  const response = await fetch('/api/v1/users/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

infoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = $('#name').value;
  const email = $('#email').value;
  console.log(name, email);
  const result = await updateMe(name, email);
  location.reload();
});

console.log(infoForm, passwordForm);
