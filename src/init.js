import i18next from 'i18next';
import runApp from './controller.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: {
        translation: {
          duplicateError: 'RSS уже существует',
          error: 'Ссылка должна быть валидным URL',
        },
      },
    },
  });
  runApp(i18nextInstance);
};
