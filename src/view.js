const elements = {
  title: document.querySelector('.modal-title'),
  input: document.getElementById('floatingInput'),
  description: document.querySelector('.modal-body'),
  submit: document.querySelector('.w-100'),
};

export const renderPosts = (el) => {
  const list = document.querySelector('.container:last-child .col:first-child ul');
  const item = document.createElement('li');
  item.classList.add('list-group-item', 'border-0', 'd-flex', 'justify-content-between');
  const link = document.createElement('a');
  link.textContent = el.name;
  link.href = el.link;
  link.classList.add('fw-bold');
  const button = document.createElement('button');
  button.textContent = 'Просмотр';
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#exampleModal');
  item.append(link, button);
  list.append(item);
};

export const renderModal = (post, el) => {
  // const modalTitle = document.querySelector('.modal-title');
  // const modalBody = document.querySelector('.modal-body');
  const link = el.querySelector('a');
  // modalTitle.textContent = post.name;
  elements.title.textContent = post.name;
  link.classList.remove('fw-bold');
  link.classList.add('fw-normal');
  // modalBody.textContent = post.postDescription;
  elements.description.textContent = post.postDescription;
};

export const renderFeeds = (title, description) => {
  const list = document.querySelector('.container:last-child .col:last-child ul');
  const item = document.createElement('li');
  item.classList.add('list-group-item', 'border-0');
  const feedTitle = document.createElement('h3');
  feedTitle.textContent = title;
  const feedDescription = document.createElement('p');
  feedDescription.textContent = description;
  item.append(feedTitle, feedDescription);
  list.append(item);
};

export const renderState = (element, error) => {
  const message = document.querySelector('.col-10 div:last-child');
  if (error === 'RSS успешно загружен') {
    element.classList.remove('is-invalid');
    message.textContent = error;
  } else {
    message.textContent = error;
    element.classList.add('is-invalid');
  }
};

export const blockUi = () => {
  // const submit = document.querySelector('.w-100');
  // const input = document.getElementById('floatingInput');
  // submit.disabled = true;
  elements.submit.disabled = true;
  // input.setAttribute('readonly', 'true');
  elements.input.setAttribute('readonly', 'true');
};

export const unBlockUi = () => {
  // const submit = document.querySelector('.w-100');
  // const input = document.getElementById('floatingInput');
  // submit.disabled = false;
  elements.submit.disabled = false;
  // input.removeAttribute('readonly');
  // input.value = '';
  // input.focus();
  elements.input.removeAttribute('readonly');
  elements.input.value = '';
  elements.input.focus();
};
