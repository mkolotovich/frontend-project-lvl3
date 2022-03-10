import onChange from 'on-change';
// import state from './init.js';
// import state from './model.js';
// import elements from './controller.js';
import last from 'lodash/last.js';
// const handleProcessError = () => {
//   console.log(state.form.processError);
// };

// export const renderPosts = (items) => {
// const renderPosts = (items) => {
const renderPosts = (el) => {
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

// export const renderFeeds = (title, description) => {
const renderFeeds = (title, description) => {
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

// export const renderErrors = (element, error) => {
const renderErrors = (element, error) => {
  // const fieldElement = element.name;
  const message = document.querySelector('.col-10 div:last-child');
  if (error === 'RSS успешно загружен') {
    // fieldElement.classList.remove('is-invalid');
    element.classList.remove('is-invalid');
    message.textContent = error;
  } else {
    message.textContent = error;
    // fieldElement.classList.add('is-invalid');
    element.classList.add('is-invalid');
  }
};

// export const watchedState = onChange(state, (path) => {
export default (state, i18next) => {
  const element = document.getElementById('floatingInput');
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.processState':
        break;
      case 'form.processError':
        // handleProcessError();
        renderErrors(element, i18next.t('duplicateError'));
        break;
      case 'form.valid':
        break;
      case 'form.errors':
        break;
      case 'form.posts': {
        const item = last(watchedState.form.posts);
        renderPosts(item);
        break;
      }
      case 'form.feeds':
        renderErrors(element, i18next.t('success'));
        break;
      case 'form.feedsDescription': {
        const { title, description } = last(watchedState.form.feedsDescription);
        renderFeeds(title, description);
        break;
      }
      default:
        break;
    }
  });
  return watchedState;
};
// const watchedState = onChange(state, (path) => {
//   switch (path) {
//     case 'form.processState':
//       break;
//     case 'form.processError':
//       // handleProcessError();
//       break;
//     case 'form.valid':
//       break;
//     case 'form.errors':
//       break;
//     case 'form.posts':
//       // renderPosts();
//       break;
//     default:
//       break;
//   }
// });

// export default watchedState;
