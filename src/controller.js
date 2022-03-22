import * as yup from 'yup';
import uniqueId from 'lodash/uniqueId.js';
import uniqBy from 'lodash/uniqBy.js';
import empty from 'lodash/isEmpty.js';
import axios from 'axios';

const parse = (response) => {
  const parser = new DOMParser();
  // return parser.parseFromString(response, 'application/xml');
  const doc = parser.parseFromString(response, 'application/xml');
  if (doc.querySelector('parsererror') === null) {
    const title = doc.querySelector('title').textContent;
    const description = doc.querySelector('description').textContent;
    const items = doc.querySelectorAll('item');
    return { title, description, items };
  }
  return {};
};

const validate = (fields) => {
  const schema = yup.object().shape({
    name: yup.string().url().trim().required(),
  });
  return schema.validate(fields, { abortEarly: false })
    .then(() => '').catch(() => 'invalidUrl');
};

// const addNewPosts = (state, value, i18next, feedId, posts) => {
const addNewPosts = (state, value, feedId, posts) => {
  const watchedState = state;
  axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(value)}`)
    .then((response) => {
      // const doc = parse(response.data.contents);
      const doc = parse(response.data.contents);
      if (!watchedState.form.feeds.includes(value)) {
        // if (doc.querySelector('parsererror') === null) {
        if (!empty(doc)) {
          // const title = doc.querySelector('title').textContent;
          // const description = doc.querySelector('description').textContent;
          // const items = doc.querySelectorAll('item');
          watchedState.form.feeds.push(value);
          watchedState.form.processState = 'sent';
          // watchedState.form.feedsDescription.push({ title, description, id: feedId });
          const { title, description, items } = doc;
          watchedState.form.feedsDescription.push({ title, description, id: feedId });
          items.forEach((el) => {
            const name = el.querySelector('title').textContent;
            const postDescription = el.querySelector('description').textContent;
            const link = el.querySelector('link').textContent;
            watchedState.form.posts.push({
              name, postDescription, isReaded: false, id: uniqueId(`${feedId}_`), link,
            });
          });
          const renderedPosts = document.querySelectorAll('.col-8 .list-group li');
          renderedPosts.forEach((el) => {
            const button = el.querySelector('button');
            button.addEventListener('click', () => {
              const link = el.querySelector('a');
              const post = posts.find((item) => item.name === link.textContent);
              watchedState.form.currentNode = el;
              post.isReaded = true;
            });
          });
        } else {
          watchedState.form.processError = 'uncorrectRss';
          watchedState.form.processState = 'error';
        }
      // } else if (doc.querySelector('parsererror') === null) {
      } else if (!empty(doc)) {
        // const items = doc.querySelectorAll('item');
        const { items } = doc;
        const newPosts = [];
        items.forEach((el) => {
          const name = el.querySelector('title').textContent;
          newPosts.push({ name, id: uniqueId(`${feedId}_`) });
        });
        const res = [...posts, ...newPosts];
        const result = uniqBy(res, 'name');
        const newPostsDiff = result.slice(posts.length);
        newPostsDiff.map((el) => watchedState.form.posts.push(el));
        // setTimeout(addNewPosts, 5000, watchedState, value, i18next, feedId, posts);
        setTimeout(addNewPosts, 5000, watchedState, value, feedId, posts);
      }
    })
    .catch(() => {
      watchedState.form.processError = 'networkError';
      watchedState.form.processState = 'error';
    });
};

// export default (i18next, state, watchedPosts) => {
export default (state, watchedPosts) => {
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.elements.url;
    const { value } = input;
    const watchedState = state;
    watchedState.form.fields.name = value;
    validate(watchedState.form.fields)
      .then((errors) => {
        watchedState.form.valid = errors === '';
        watchedState.form.processState = 'sending';
        if (watchedState.form.valid && !watchedState.form.feeds.includes(value)) {
          const feedId = uniqueId();
          // addNewPosts(watchedState, value, i18next, feedId, watchedPosts);
          addNewPosts(watchedState, value, feedId, watchedPosts);
          // setTimeout(addNewPosts, 5000, watchedState, value, i18next, feedId, watchedPosts);
          setTimeout(addNewPosts, 5000, watchedState, value, feedId, watchedPosts);
        } else if (watchedState.form.feeds.includes(value)) {
          watchedState.form.processError = 'duplicateError';
          watchedState.form.processState = 'error';
        } else {
          watchedState.form.processError = `${errors}`;
          watchedState.form.processState = 'error';
        }
      });
  });
};
