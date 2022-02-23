const $ = document.querySelector.bind(document);

export const updateMe = async (data) => {
  const response = await fetch('/api/v1/users/me', {
    method: 'PATCH',
    body: data,
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
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};
