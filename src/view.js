import onChange from 'on-change';
import state from './model.js';

const handleProcessError = () => {
  console.log(state.form.processError);
};

export const renderPosts = (items) => {
  const list = document.querySelector('.container:last-child .col:first-child ul');
  items.forEach((el) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'border-0');
    const link = document.createElement('a');
    link.textContent = el.querySelector('title').textContent;
    link.href = el.querySelector('link').textContent;
    item.append(link);
    list.append(item);
  });
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

export const renderErrors = (element, error) => {
  const fieldElement = element.name;
  if (error === '') {
    fieldElement.classList.remove('is-invalid');
  } else {
    if (!element.container.querySelector('div')) {
      const feedbackElement = document.createElement('div');
      feedbackElement.classList.add('invalid-feedback');
      feedbackElement.textContent = error;
      fieldElement.after(feedbackElement);
    } else {
      const feedbackElement = element.container.querySelector('div');
      feedbackElement.textContent = error;
    }
    fieldElement.classList.add('is-invalid');
  }
};

export const watchedState = onChange(state, (path) => {
  switch (path) {
    case 'form.processState':
      break;
    case 'form.processError':
      handleProcessError();
      break;
    case 'form.valid':
      break;
    case 'form.errors':
      break;
    default:
      break;
  }
});
