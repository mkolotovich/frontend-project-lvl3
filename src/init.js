import i18next from 'i18next';
import onChange from 'on-change';
import last from 'lodash/last.js';
import runApp from './controller.js';
import {
  // renderErrors, renderPosts, renderFeeds, blockUi, unBlockUi,
  renderState, renderPosts, renderFeeds, blockUi, unBlockUi,
} from './view.js';

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
  const handleError = (element, error) => {
    if (error === 'duplicateError') {
      renderState(element, i18nextInstance.t('duplicateError'));
    } else if (error === 'Ссылка должна быть валидным URL') {
      renderState(element, i18nextInstance.t('error'));
    } else if (error === 'uncorrectRss') {
      renderState(element, i18nextInstance.t('uncorrectRss'));
    } else if (error === 'networkError') {
      renderState(element, i18nextInstance.t('networkError'));
    }
  };
  const watchedState = onChange(state, (path, value) => {
    const element = document.getElementById('floatingInput');
    switch (path) {
      // case 'form.processError':
      // if (value === 'duplicateError') {
      // renderErrors(element, i18nextInstance.t('duplicateError'));
      // } else if (value === 'Ссылка должна быть валидным URL') {
      // renderErrors(element, i18nextInstance.t('error'));
      // } else if (value === 'uncorrectRss') {
      // renderErrors(element, i18nextInstance.t('uncorrectRss'));
      // } else if (value === 'networkError') {
      // renderErrors(element, i18nextInstance.t('networkError'));
      // }
      // break;
      case 'form.posts': {
        const item = last(watchedState.form.posts);
        renderPosts(item);
        break;
      }
      case 'form.feeds':
        // renderErrors(element, i18nextInstance.t('success'));
        renderState(element, i18nextInstance.t('success'));
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
          handleError(element, watchedState.form.processError);
          unBlockUi();
        }
        break;
      default:
        break;
    }
  });
  runApp(i18nextInstance, watchedState);
};
