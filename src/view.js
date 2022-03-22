export const renderPosts = (el, viewMessage, i18next, elements) => {
  const item = document.createElement('li');
  item.classList.add('list-group-item', 'border-0', 'd-flex', 'justify-content-between');
  const link = document.createElement('a');
  link.textContent = el.name;
  link.href = el.link;
  link.classList.add('fw-bold');
  const button = document.createElement('button');
  button.textContent = i18next.t(viewMessage);
  button.setAttribute('data-bs-toggle', 'modal');
  button.setAttribute('data-bs-target', '#exampleModal');
  item.append(link, button);
  elements.postsList.append(item);
};

export const renderModal = (post, el, selectors) => {
  const link = el.querySelector('a');
  const elements = selectors;
  elements.modalTitle.textContent = post.name;
  link.classList.remove('fw-bold');
  link.classList.add('fw-normal');
  elements.modalBody.textContent = post.postDescription;
};

export const renderFeeds = (title, description, elements) => {
  const item = document.createElement('li');
  item.classList.add('list-group-item', 'border-0');
  const feedTitle = document.createElement('h3');
  feedTitle.textContent = title;
  const feedDescription = document.createElement('p');
  feedDescription.textContent = description;
  item.append(feedTitle, feedDescription);
  elements.feedsList.append(item);
};

export const renderState = (message, i18next, selectors) => {
  const elements = selectors;
  if (message === 'success') {
    elements.input.classList.remove('is-invalid');
  } else {
    elements.input.classList.add('is-invalid');
  }
  elements.messageNode.textContent = i18next.t(message);
};

export const blockUi = (selectors) => {
  const elements = selectors;
  elements.submit.disabled = true;
  elements.input.setAttribute('readonly', 'true');
};

export const unBlockUi = (selectors) => {
  const elements = selectors;
  elements.submit.disabled = false;
  elements.input.removeAttribute('readonly');
  elements.input.value = '';
  elements.input.focus();
};
