export const renderPosts = (el) => {
  const list = document.querySelector('.container:last-child .col:first-child ul');
  // items.forEach((el) => {
  const item = document.createElement('li');
  item.classList.add('list-group-item', 'border-0', 'd-flex', 'justify-content-between');
  const link = document.createElement('a');
  // link.textContent = el.querySelector('title').textContent;
  link.textContent = el.name;
  // link.href = el.querySelector('link').textContent;
  link.href = el.link;
  link.classList.add('fw-bold');
  const button = document.createElement('button');
  button.textContent = 'Просмотр';
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#exampleModal');
  item.append(link, button);
  // list.prepend(item);
  list.append(item);
  // });
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
  const form = document.querySelector('form');
  form.reset();
};

export const renderErrors = (element, error) => {
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
  const submit = document.querySelector('.w-100');
  const input = document.getElementById('floatingInput');
  submit.disabled = true;
  input.setAttribute('readonly', 'true');
};

export const unBlockUi = () => {
  const submit = document.querySelector('.w-100');
  const input = document.getElementById('floatingInput');
  submit.disabled = false;
  input.removeAttribute('readonly');
};
