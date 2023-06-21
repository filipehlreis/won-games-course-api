/**
 * order controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  // Method 1: Creating an entirely custom action
  async createPaymentIntent(ctx) {
    return "Hello world!"
  },
}));
