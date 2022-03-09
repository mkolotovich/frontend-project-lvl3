import i18next from 'i18next';
import runApp from './controller.js';
import view from './view.js';

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

  // return [state, i18nextInstance];
  // view(state, i18nextInstance);
  runApp(i18nextInstance, view(state, i18nextInstance));
  // runApp(i18nextInstance, state);
  // runApp(i18nextInstance);
};
