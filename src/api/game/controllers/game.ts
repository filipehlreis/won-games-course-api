/**
 * game controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::game.game', ({ strapi }) =>  ({
  // Method 1: Creating an entirely custom action
  async populate(ctx) {
    try {
      console.log('Starting to populate');
      console.log(ctx.query)
      ctx.send("Finished populating!")
    } catch (err) {
      ctx.body = err;
    }
  },
}));
