import i18next from 'i18next';
import onChange from 'on-change';
import last from 'lodash/last.js';
import runApp from './controller.js';
// import view from './view.js';
import { renderErrors, renderPosts, renderFeeds } from './view.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  const state = {
    form: {
      feeds: [],
      valid: true,
      processState: 'filling',
      processError: null,
      errors: {},
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
          error: 'Ссылка должна быть валидным URL',
          uncorrectRss: 'Ресурс не содержит валидный RSS',
          networkError: 'Ошибка сети',
          success: 'RSS успешно загружен',
        },
      },
    },
  });
  const watchedState = onChange(state, (path) => {
    const element = document.getElementById('floatingInput');
    switch (path) {
      case 'form.processState':
        break;
      case 'form.processError':
        renderErrors(element, i18nextInstance.t('duplicateError'));
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
        renderErrors(element, i18nextInstance.t('success'));
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
  // return [state, i18nextInstance];
  // view(state, i18nextInstance);
  // runApp(i18nextInstance, view(state, i18nextInstance));
  runApp(i18nextInstance, watchedState);
  // runApp(i18nextInstance, state);
  // runApp(i18nextInstance);
};
