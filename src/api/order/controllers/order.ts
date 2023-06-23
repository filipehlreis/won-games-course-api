/**
 * order controller
 */

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
            , {})
          if (validatedGame) {
            games.push(validatedGame)
          }

          console.log(validatedGame)
        })
      )
      return games;

    } catch (error) {
      console.log(error)
      return "Deu ruim"
    }
  },
}));
