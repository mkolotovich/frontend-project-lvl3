import i18next from 'i18next';
import onChange from 'on-change';
import last from 'lodash/last.js';
import runApp from './controller.js';
import {
  renderState, renderPosts, renderFeeds, renderModal, blockUi, unBlockUi,
} from './view.js';

export default () => {
  const i18nextInstance = i18next.createInstance();

  const state = {
    form: {
      feeds: [],
      valid: true,
      processState: 'filling',
      processError: null,
      fields: {
        name: '',
      },
      feedsDescription: [],
      posts: [],
    },
  };

  i18nextInstance.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: {
          duplicateError: 'RSS уже существует',
          invalidUrl: 'Ссылка должна быть валидным URL',
          uncorrectRss: 'Ресурс не содержит валидный RSS',
          'Network Error': 'Ошибка сети',
          success: 'RSS успешно загружен',
          viewMessage: 'Просмотр',
        },
      },
    },
  });

  const elements = {
    feedsList: document.querySelector('.container .col:last-child ul'),
    postsList: document.querySelector('.container .col:first-child ul'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    input: document.getElementById('floatingInput'),
    messageNode: document.querySelector('.col-10 div:last-child'),
    submit: document.querySelector('.w-100'),
  };

  const watchedPosts = onChange(state.form.posts, (path) => {
    if (path !== '') {
      const [index] = path.split('.');
      renderModal(state.form.posts[index], elements);
    }
  });

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.posts': {
        renderPosts(watchedState.form.posts, 'viewMessage', i18nextInstance, elements);
        break;
      }
      case 'form.feeds':
        renderState('success', i18nextInstance, elements);
        break;
      case 'form.feedsDescription': {
        const { title, description } = last(watchedState.form.feedsDescription);
        renderFeeds(title, description, elements);
        break;
      }
      case 'form.processState':
        if (value === 'sending') {
          blockUi(elements);
        } else if (value === 'sent') {
          unBlockUi(elements);
        } else if (value === 'error') {
          renderState(watchedState.form.processError, i18nextInstance, elements);
          unBlockUi(elements);
        }
        break;
      default:
        break;
    }
  });

  runApp(watchedState, watchedPosts);
};
