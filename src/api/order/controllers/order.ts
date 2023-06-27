/**
 * order controller
 */

const stripe = require('stripe')(process.env.STRIPE_KEY)

import { factories } from '@strapi/strapi'

export type gameProps = {
  id: string
}

export type cartProps = {
  cart?: [gameProps] | null
}



export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  // Method 1: Creating an entirely custom action
  async createPaymentIntent(ctx) {

    try {

      const { cart }: cartProps = ctx.request.body;

      let games = []


      // await strapi.entityService.findMany(`api::${entityName}.${entityName}`, {
      //   fields: ['name'],
      //   filters: { name: name },
      //   sort: 'name',
      // })

      await Promise.all(
        cart?.map(async (game) => {
          const validatedGame = await strapi.entityService.findOne('api::game.game', game.id
            , {});
          if (validatedGame) {
            games.push(validatedGame);
          }

          console.log(validatedGame);
        })
      )


      if (!games.length) {
        ctx.response.status = 404;
        return {
          error: "No valid games found!",
        }
      }

      const total = games.reduce((acc, game) => {
        return acc + game.price;
      }, 0)

      if (total === 0) {
        return {
          freeGames: true
        }
      }

      return { total_in_cents: total * 100, games };

    } catch (error) {
      console.log(error)
      return "Deu ruim"
    }
  },
}));
