import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty.js';
import axios from 'axios';
import { watchedState, renderErrors } from './view.js';

const schema = yup.object().shape({
  name: yup.string().url().trim().required(),
});

const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

const validate = (fields, i18next) => schema.validate(fields, { abortEarly: false })
  .then(() => {
    const obj = {};
    return obj;
  }).catch((err) => {
    const messages = err.errors.map(() => i18next.t('error'));
    return messages;
  });

export default (i18next) => {
  const elements = {
    container: document.querySelector('.form-floating'),
    form: document.querySelector('form'),
    name: document.getElementById('floatingInput'),
    submitButton: document.querySelector('input[type="submit"]'),
  };
  elements.name.focus();
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.target[0];
    const { value } = input;
    watchedState.form.fields.name = value;
    validate(watchedState.form.fields, i18next)
      .then((errors) => {
        watchedState.form.valid = isEmpty(errors);
        watchedState.form.processState = 'sending';
        if (watchedState.form.valid && !watchedState.form.feeds.includes(value)) {
          axios.get(value)
            .then((response) => {
              renderErrors(elements, '');
              if (!watchedState.form.feeds.includes(value)) {
                watchedState.form.feeds.push(value);
                elements.form.reset();
                elements.name.focus();
              }
              console.log(response);
            })
            .catch((error) => {
              console.log(error);
              watchedState.form.processState = 'error';
              watchedState.form.processError = errorMessages.network.error;
              throw error;
            });
        } else if (watchedState.form.feeds.includes(value)) {
          renderErrors(elements, i18next.t('duplicateError'));
        } else {
          renderErrors(elements, errors);
        }
      });
    watchedState.form.processState = 'sent';
  });
};
