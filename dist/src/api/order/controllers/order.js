"use strict";
/**
 * order controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("@strapi/utils");
const { sanitizeEntity } = utils;
const stripe = require('stripe')(process.env.STRIPE_KEY);
const strapi_1 = require("@strapi/strapi");
const cart_1 = require("../../../../config/functions/cart");
exports.default = strapi_1.factories.createCoreController('api::order.order', ({ strapi }) => ({
    // Method 1: Creating an entirely custom action
    async createPaymentIntent(ctx) {
        try {
            const { cart } = ctx.request.body;
            // simplify cart data
            const cartGamesIds = await (0, cart_1.cartGamesIdsFn)(cart);
            // get all games
            const games = await (0, cart_1.cartItems)(cartGamesIds);
            console.log('imprimindo uma vez aqui');
            if (!games.length) {
                ctx.response.status = 404;
                return {
                    error: "No valid games found!",
                };
            }
            const total = await (0, cart_1.cartTotalInCents)(games);
            if (total === 0) {
                return {
                    freeGames: true
                };
            }
            try {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: (total * 100).toFixed(),
                    currency: "usd",
                    metadata: {
                        cart: JSON.stringify(cartGamesIds)
                    }
                });
                return paymentIntent;
            }
            catch (err) {
                console.log(err);
                return {
                    error: err.raw.message
                };
            }
        }
        catch (error) {
            console.log(error);
            return "Deu ruim";
        }
    },
    async create(ctx) {
        // pegar as informacoes do frontend
        const { cart, paymentIntentId, paymentMethod } = ctx.request.body;
        // pegar o usuario
        const { id: userId } = await strapi.service("plugin::users-permissions.jwt").getToken(ctx);
        ;
        console.log(userId);
        // pegar as informacoes do usuario
        const userInfo = await strapi.db.query("plugin::users-permissions.user").findOne({ where: { id: userId } });
        // simplify cart data
        const cartGamesIds = await (0, cart_1.cartGamesIdsFn)(cart);
        // get all games
        const games = await (0, cart_1.cartItems)(cartGamesIds);
        // pegar o total ( saber se eh free ou nao)
        const total_in_cents = await (0, cart_1.cartTotalInCents)(games);
        // precisa pegar do frontend os valores paymentMethod e recuperar por aqui
        // salvar no banco
        const entry = {
            data: {
                total_in_cents,
                payment_intent_id: paymentIntentId,
                card_brand: null,
                card_last4: null,
                user: userInfo,
                games: games,
            }
        };
        const entity = await strapi.entityService.create('api::order.order', entry);
        // enviar um email da compra para o usuario
        // retornando que foi salvo no banco
        return this.sanitizeOutput(entity, ctx);
    }
}));
