"use strict";
/**
 * order controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
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
                console.log(validatedGame);
            }));
            if (!games.length) {
                ctx.response.status = 404;
                return {
                    error: "No valid games found!",
                };
            }
            const total = games.reduce((acc, game) => {
                return acc + game.price;
            }, 0);
            return { total_in_cents: total * 100, games };
        }
        catch (error) {
            console.log(error);
            return "Deu ruim";
        }
    },
}));
