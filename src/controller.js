import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty.js';
import uniqueId from 'lodash/uniqueId.js';
import uniqBy from 'lodash/uniqBy.js';
import axios from 'axios';

const schema = yup.object().shape({
  name: yup.string().url().trim().required(),
});

const parse = (response) => {
  const parser = new DOMParser();
  return parser.parseFromString(response, 'application/xml');
};

const validate = (fields, i18next) => schema.validate(fields, { abortEarly: false })
  .then(() => {
    const obj = {};
    return obj;
  }).catch((err) => {
    const messages = err.errors.map(() => i18next.t('error'));
    return messages;
  });

const addNewPosts = (watchedState, elements, value, i18next, feedId, posts) => {
  axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(value)}`)
    .then((response) => {
      const doc = parse(response.data.contents);
      if (!watchedState.form.feeds.includes(value)) {
        if (doc.querySelector('parsererror') === null) {
          const title = doc.querySelector('title').textContent;
          const description = doc.querySelector('description').textContent;
          const items = doc.querySelectorAll('item');
          watchedState.form.feeds.push(value);
          watchedState.form.feedsDescription.push({ title, description, id: feedId });
          items.forEach((el) => {
            const name = el.querySelector('title').textContent;
            const postDescription = el.querySelector('description').textContent;
            const link = el.querySelector('link').textContent;
            watchedState.form.posts.push({
              name, postDescription, isReaded: false, id: uniqueId(`${feedId}_`, link),
            });
          });
          // renderPosts(Array.from(items).reverse());
          const modalTitle = document.querySelector('.modal-title');
          const modalBody = document.querySelector('.modal-body');
          const renderedPosts = document.querySelectorAll('.col-8 .list-group li');
          renderedPosts.forEach((el) => {
            const button = el.querySelector('button');
            button.addEventListener('click', () => {
              const link = el.querySelector('a');
              modalTitle.textContent = link.textContent;
              link.classList.remove('fw-bold');
              link.classList.add('fw-normal');
              const post = watchedState.form.posts.find((item) => item.name === link.textContent);
              modalBody.textContent = post.postDescription;
            });
          });
          elements.name.focus();
        } else {
          const state = watchedState;
          state.form.processError = 'uncorrectRss';
        }
      } else if (doc.querySelector('parsererror') === null) {
        const items = doc.querySelectorAll('item');
        const newPosts = [];
        items.forEach((el) => {
          const name = el.querySelector('title').textContent;
          newPosts.push({ name, id: uniqueId(`${feedId}_`) });
        });
        const res = [...posts, ...newPosts];
        const result = uniqBy(res, 'name');
        const newPostsDiff = result.slice(posts.length);
        newPostsDiff.map((el) => watchedState.form.posts.push(el));
        // renderPosts(Array.from(items).slice(0, newPostsDiff.length).reverse());
        setTimeout(addNewPosts, 5000,
          watchedState, elements, value, i18next, feedId, watchedState.form.posts);
      } else {
      // renderErrors(elements, i18next.t('uncorrectRss'));
      }
    })
    .catch(() => {
      const state = watchedState;
      state.form.processError = 'networkError';
    });
};

export default (i18next, state) => {
  const elements = {
    title: document.querySelector('.modal-title'),
    form: document.querySelector('form'),
    name: document.getElementById('floatingInput'),
    description: document.querySelector('.modal-body'),
    submit: document.querySelector('.w-100'),
  };
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    elements.submit.disabled = true;
    const input = elements.form.elements.url;
    const { value } = input;
    const watchedState = state;
    watchedState.form.fields.name = value;
    let correctValue;
    validate(watchedState.form.fields, i18next)
      .then((errors) => {
        watchedState.form.valid = isEmpty(errors);
        watchedState.form.processState = 'sending';
        if (value.lastIndexOf('http') !== 0) {
          correctValue = value.slice(0, value.lastIndexOf('http'));
        } else {
          correctValue = value;
        }
        if (watchedState.form.valid && !watchedState.form.feeds.includes(correctValue)) {
          const feedId = uniqueId();
          addNewPosts(watchedState, elements, correctValue, i18next, feedId);
          setTimeout(addNewPosts, 5000,
            watchedState, elements, value, i18next, feedId, watchedState.form.posts);
        } else if (watchedState.form.feeds.includes(correctValue)) {
          watchedState.form.processError = 'duplicateError';
        } else {
          watchedState.form.processError = `${errors}`;
        }
      });
    elements.submit.disabled = false;
    watchedState.form.processState = 'sent';
  });
};
