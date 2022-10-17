/**
 * game controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::game.game', ({ strapi }) => ({
  // Method 1: Creating an entirely custom action
  async populate(ctx) {
    try {
      console.log('Starting to populate');

      await strapi.service('api::game.populate').populate()

      console.log('Finished populating!');
      ctx.send("Finished populating!")
    } catch (err) {
      ctx.send("Deu ruim!")
      ctx.body = err;
    }
  },
}));
