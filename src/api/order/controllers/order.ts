/**
 * order controller
 */

const utils = require("@strapi/utils");
const { sanitizeEntity } = utils;


const stripe = require('stripe')(process.env.STRIPE_KEY)

import { factories } from '@strapi/strapi'
import { cartGamesIdsFn, cartItems, cartTotalInCents } from '../../../../config/functions/cart'
import { emailTemplateOrder } from '../services/order';

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

      // simplify cart data
      const cartGamesIds = await cartGamesIdsFn(cart)

      // get all games
      const games = await cartItems(cartGamesIds)

      console.log('imprimindo uma vez aqui')

      if (!games.length) {
        ctx.response.status = 404;
        return {
          error: "No valid games found!",
        }
      }

      const total = await cartTotalInCents(games)

      if (total === 0) {
        return {
          freeGames: true
        }
      }

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: total,
          currency: "usd",
          metadata: {
            cart: JSON.stringify(cartGamesIds)
          }
        })

        return paymentIntent;
      } catch (err) {
        console.log(err);
        return {
          error: err.raw.message
        };
      }

    } catch (error) {
      console.log(error)
      return "Deu ruim"
    }
  },

  async create(ctx) {
    // pegar as informacoes do frontend
    const { cart, paymentIntentId, paymentMethod } = ctx.request.body

    // pegar o usuario
    const { id: userId } = await strapi.service("plugin::users-permissions.jwt").getToken(ctx)
    console.log(userId)

    // pegar as informacoes do usuario
    const userInfo = await strapi.db.query("plugin::users-permissions.user").findOne({ where: { id: userId } })

    // simplify cart data
    const cartGamesIds = await cartGamesIdsFn(cart)

    // get all games
    const games = await cartItems(cartGamesIds)

    // pegar o total ( saber se eh free ou nao)
    const total_in_cents = await cartTotalInCents(games)

    // precisa pegar do frontend os valores paymentMethod e recuperar por aqui
    let paymentInfo;
    // paymentInfo = await stripe.paymentMethods.retrieve(paymentMethod);
    if (total_in_cents !== 0) {

      // console.log('paymentMethod', paymentMethod)
      // console.log('paymentIntentId', paymentIntentId)
      try {
        // console.log('chegou aqui')
        paymentInfo = await stripe.paymentMethods.retrieve(paymentMethod);
        // console.log('chegou aqui 2 ')
      } catch (error) {
        ctx.response.status = 402
        // console.log('chegou aqui tambem')
        // console.log({ error: error.message })
        return { error: error.message }
      }


      // try {
      //   paymentInfo = await stripe.paymentMethods.retrive(paymentMethod)
      // } catch (error) {
      //   ctx.response.status = 402
      //   return { error: error.message }
      // }


    }


    // salvar no banco
    const entry = {
      data: {
        total_in_cents,
        payment_intent_id: paymentIntentId,
        card_brand: paymentInfo?.card?.brand,
        card_last4: paymentInfo?.card?.last4,
        user: userInfo,
        games: games,
      }
    }

    const entity = await strapi.entityService.create('api::order.order', entry)

    // enviar um email da compra para o usuario
    await strapi.plugins['email'].services.email.sendTemplatedEmail(
      {
        to: userInfo.email,
      },
      emailTemplateOrder,
      {
        user: userInfo,
        payment: {
          total: `$ ${total_in_cents / 100}`,
          card_brand: entry.data.card_brand,
          card_last4: entry.data.card_last4,
        },
        games
      }
    );
    // retornando que foi salvo no banco
    return this.sanitizeOutput(entity, ctx);
  }
}));
