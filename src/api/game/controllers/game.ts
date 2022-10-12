/**
 * game controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::game.game', ({ strapi }) =>  ({
  // Method 1: Creating an entirely custom action
  async populate(ctx) {
    try {
      console.log('Initializing populate');
      ctx.body = 'ok';
      ctx.send({ok:true})
      // ctx.body = 'ok ok ok';
    } catch (err) {
      ctx.body = err;
    }
  },
}));
