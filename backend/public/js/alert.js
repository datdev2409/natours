function createAlert(status, msg) {
  const html = `<div class="alert alert--${status}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', html);
}

export default createAlert;
