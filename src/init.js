import axios from 'axios';
import * as yup from 'yup';
import keyBy from 'lodash/keyBy.js';
import isEmpty from 'lodash/isEmpty.js';
import { watchedState, renderErrors } from './view.js';

const schema = yup.object().shape({
  name: yup.string().url().trim().required(),
});

export const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

const validate = (fields) => schema.validate(fields, { abortEarly: false })
  .then(() => {
    const obj = {};
    return obj;
  }).catch((e) => keyBy(e.inner, 'path'));

export default () => {
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
    validate(watchedState.form.fields)
      .then((errors) => {
        watchedState.form.valid = isEmpty(errors);
        watchedState.form.processState = 'sending';
        if (watchedState.form.valid && !watchedState.form.feeds.includes(value)) {
          axios.get(value)
            .then((response) => {
              renderErrors(elements, errors);
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
        } else {
          renderErrors(elements, errors);
          if (watchedState.form.feeds.includes(value)) {
            watchedState.form.errors.name = {};
            watchedState.form.errors.name.message = 'Duplicate feed';
            renderErrors(elements, watchedState.form.errors);
          }
        }
      });
    watchedState.form.processState = 'sent';
  });
};
