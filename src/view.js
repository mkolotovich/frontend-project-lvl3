import has from 'lodash/has.js';
import onChange from 'on-change';
import state from './model.js';

const handleProcessError = () => {
  console.log(state.form.processError);
};

export const renderErrors = (element, errors) => {
  const fieldName = 'name';
  const fieldElement = element.name;
  const error = errors[fieldName];
  const fieldHasError = has(errors, fieldName);
  if (!fieldHasError) {
    fieldElement.classList.remove('is-invalid');
  } else {
    if (!element.container.querySelector('div')) {
      const feedbackElement = document.createElement('div');
      feedbackElement.classList.add('invalid-feedback');
      feedbackElement.textContent = errors[fieldName].message;
      fieldElement.after(feedbackElement);
    } else {
      const feedbackElement = element.container.querySelector('div');
      feedbackElement.textContent = error.message;
    }
    fieldElement.classList.add('is-invalid');
  }
};

export const watchedState = onChange(state, (path) => {
  switch (path) {
    case 'form.processState':
      break;
    case 'form.processError':
      handleProcessError();
      break;
    case 'form.valid':
      break;
    case 'form.errors':
      break;
    default:
      break;
  }
});
