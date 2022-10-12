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
            console.log(ctx.query);
            ctx.send("Finished populating!");
        }
        catch (err) {
            ctx.body = err;
        }
    },
}));
