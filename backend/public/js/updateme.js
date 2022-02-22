const $ = document.querySelector.bind(document);

export const updateMe = async (name, email) => {
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

export const updatePassword = async (
  password,
  newPassword,
  confirmPassword
) => {
  const data = { password, newPassword, confirmPassword };
  const response = await fetch('/api/v1/auth/password-update', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
