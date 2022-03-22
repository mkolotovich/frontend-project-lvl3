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

  const handleError = (element, error) => {
    if (error === 'duplicateError') {
      renderState(element, i18nextInstance.t('duplicateError'));
    } else if (error === 'invalidUrl') {
      renderState(element, i18nextInstance.t('invalidUrl'));
    } else if (error === 'uncorrectRss') {
      renderState(element, i18nextInstance.t('uncorrectRss'));
    } else if (error === 'networkError') {
      renderState(element, i18nextInstance.t('networkError'));
    }
  };

  const watchedPosts = onChange(state.form.posts, (path) => {
    const [index] = path.split('.');
    renderModal(state.form.posts[index], state.form.currentNode);
  });

  const watchedState = onChange(state, (path, value) => {
    const element = document.getElementById('floatingInput');
    switch (path) {
      case 'form.posts': {
        const item = last(watchedState.form.posts);
        renderPosts(item, i18nextInstance.t('viewMessage'));
        break;
      }
      case 'form.feeds':
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

  runApp(i18nextInstance, watchedState, watchedPosts);
};
