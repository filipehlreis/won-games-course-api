"use strict";
/**
 * game controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::game.game', ({ strapi }) => ({
    // Method 1: Creating an entirely custom action
    async populate(ctx) {
        try {
            console.log('Starting to populate');
            const options = {
                sort: "popularity",
                page: "1",
                ...ctx.query
            };
            await strapi.service('api::game.populate').populate(options);
            console.log('Finished populating!');
            ctx.send("Finished populating!");
        }
        catch (err) {
            ctx.send("Deu ruim!");
            ctx.body = err;
        }
    },
}));
