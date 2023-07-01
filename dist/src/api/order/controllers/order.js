"use strict";
/**
 * order controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const stripe = require('stripe')(process.env.STRIPE_KEY);
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::order.order', ({ strapi }) => ({
    // Method 1: Creating an entirely custom action
    async createPaymentIntent(ctx) {
        try {
            const { cart } = ctx.request.body;
            let games = [];
            // await strapi.entityService.findMany(`api::${entityName}.${entityName}`, {
            //   fields: ['name'],
            //   filters: { name: name },
            //   sort: 'name',
            // })
            await Promise.all(cart === null || cart === void 0 ? void 0 : cart.map(async (game) => {
                const validatedGame = await strapi.entityService.findOne('api::game.game', game.id, {});
                if (validatedGame) {
                    games.push(validatedGame);
                }
                // console.log(validatedGame);
            }));
            console.log('imprimindo uma vez aqui');
            if (!games.length) {
                ctx.response.status = 404;
                return {
                    error: "No valid games found!",
                };
            }
            const total = games.reduce((acc, game) => {
                return acc + game.price;
            }, 0);
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
                        integration_check: "accept_a_payment"
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
        console.log(userInfo);
        // pergar os jogos
        // pegar o total ( saber se eh free ou nao)
        // pegar o paymentIntentId
        // pegar as informacoes do pagamento (paymentMethod)
        // salvar no banco
        // enviar um email da compra para o usuario
        return { cart, paymentIntentId, paymentMethod, userInfo };
    }
}));
