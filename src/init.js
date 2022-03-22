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
      currentNode: {},
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
          networkError: 'Ошибка сети',
          success: 'RSS успешно загружен',
          viewMessage: 'Просмотр',
        },
      },
    },
  });

  const watchedPosts = onChange(state.form.posts, (path) => {
    const [index] = path.split('.');
    renderModal(state.form.posts[index], state.form.currentNode);
  });

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.posts': {
        const item = last(watchedState.form.posts);
        renderPosts(item, 'viewMessage', i18nextInstance);
        break;
      }
      case 'form.feeds':
        renderState('success', i18nextInstance);
        break;
      case 'form.feedsDescription': {
        const { title, description } = last(watchedState.form.feedsDescription);
        renderFeeds(title, description);
        break;
      }
      case 'form.processState':
        if (value === 'sending') {
          blockUi();
        } else if (value === 'sent') {
          unBlockUi();
        } else if (value === 'error') {
          renderState(watchedState.form.processError, i18nextInstance);
          unBlockUi();
        }
        break;
      default:
        break;
    }
  });

  runApp(i18nextInstance, watchedState, watchedPosts);
};
