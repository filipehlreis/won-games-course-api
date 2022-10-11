'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('repositories')
      .service('myService')
      .getWelcomeMessage();
  },
});
