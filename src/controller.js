import * as yup from 'yup';
import uniqueId from 'lodash/uniqueId.js';
import uniqBy from 'lodash/uniqBy.js';
import empty from 'lodash/isEmpty.js';
import axios from 'axios';

const parse = (response, feedId) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(response, 'application/xml');
  if (doc.querySelector('parsererror') === null) {
    const title = doc.querySelector('title').textContent;
    const description = doc.querySelector('description').textContent;
    const items = doc.querySelectorAll('item');
    const posts = [];
    items.forEach((el) => {
      const name = el.querySelector('title').textContent;
      const postDescription = el.querySelector('description').textContent;
      const link = el.querySelector('link').textContent;
      posts.push({
        name, postDescription, isReaded: false, id: uniqueId(`${feedId}_`), link,
      });
    });
    return { title, description, posts };
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

const addNewPosts = (state, value, feedId, posts) => {
  const watchedState = state;
  const parsedURL = new URL('https://allorigins.hexlet.app/get');
  parsedURL.searchParams.set('disableCache', 'true');
  parsedURL.searchParams.set('url', value);
  axios.get(parsedURL.href)
    .then((response) => {
      const doc = parse(response.data.contents, feedId);
      if (!watchedState.form.feeds.includes(value)) {
        if (!empty(doc)) {
          watchedState.form.feeds.push(value);
          watchedState.form.processState = 'sent';
          const { title, description } = doc;
          const parsedPosts = doc.posts;
          watchedState.form.feedsDescription.push({ title, description, id: feedId });
          watchedState.form.posts = parsedPosts;
          parsedPosts.forEach((el) => posts.push(el));
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
          // setTimeout(addNewPosts, 5000, watchedState, value, feedId, watchedState.form.posts);
        } else {
          watchedState.form.processError = 'uncorrectRss';
          watchedState.form.processState = 'error';
        }
      } else {
        const parsedPosts = doc.posts;
        const newPosts = parsedPosts.map((el) => {
          const { name } = el;
          return { name, id: uniqueId(`${feedId}_`) };
        });
        const res = [...posts, ...newPosts];
        const result = uniqBy(res, 'name');
        watchedState.form.posts = result;
        // setTimeout(addNewPosts, 5000, watchedState, value, feedId, posts);
      }
      setTimeout(addNewPosts, 5000, watchedState, value, feedId, watchedState.form.posts);
    })
    .catch(() => {
      watchedState.form.processError = 'networkError';
      watchedState.form.processState = 'error';
    });
};

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
          addNewPosts(watchedState, value, feedId, watchedPosts);
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
