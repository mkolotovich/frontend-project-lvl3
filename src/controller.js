import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty.js';
import uniqueId from 'lodash/uniqueId.js';
import uniqBy from 'lodash/uniqBy.js';
import axios from 'axios';
import {
  watchedState, renderErrors, renderFeeds, renderPosts,
} from './view.js';

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

const addNewPosts = (elements, value, i18next, feedId, posts) => {
  axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(value)}`)
    .then((response) => {
      const doc = parse(response.data.contents);
      if (!watchedState.form.feeds.includes(value)) {
        renderErrors(elements, i18next.t('success'));
        if (doc.querySelector('parsererror') === null) {
          const title = doc.querySelector('title').textContent;
          const description = doc.querySelector('description').textContent;
          const items = doc.querySelectorAll('item');
          watchedState.form.feeds.push(value);
          watchedState.form.feedsDescription.push({ title, description, id: feedId });
          renderFeeds(title, description);
          items.forEach((el) => {
            const name = el.querySelector('title').textContent;
            const postDescription = el.querySelector('description').textContent;
            watchedState.form.posts.push({
              name, postDescription, isReaded: false, id: uniqueId(`${feedId}_`),
            });
          });
          renderPosts(Array.from(items).reverse());
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
          elements.form.reset();
          elements.name.focus();
        } else {
          renderErrors(elements, i18next.t('uncorrectRss'));
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
        renderPosts(Array.from(items).slice(0, newPostsDiff.length).reverse());
        setTimeout(addNewPosts, 5000, elements, value, i18next, feedId, watchedState.form.posts);
      } else {
        renderErrors(elements, i18next.t('uncorrectRss'));
      }
    })
    .catch(() => {
      watchedState.form.processState = 'error';
      renderErrors(elements, i18next.t('networkError'));
    });
};

export default (i18next) => {
  const elements = {
    title: document.querySelector('.modal-title'),
    form: document.querySelector('form'),
    name: document.getElementById('floatingInput'),
    description: document.querySelector('.modal-body'),
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
          const feedId = uniqueId();
          addNewPosts(elements, value, i18next, feedId);
          setTimeout(addNewPosts, 5000, elements, value, i18next, feedId, watchedState.form.posts);
        } else if (watchedState.form.feeds.includes(value)) {
          renderErrors(elements, i18next.t('duplicateError'));
        } else {
          renderErrors(elements, errors);
        }
      });
    watchedState.form.processState = 'sent';
  });
};
