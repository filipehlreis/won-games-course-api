"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartTotalInCents = exports.cartItems = exports.cartGamesIdsFn = void 0;
const cartGamesIdsFn = async (cart) => {
    return await cart.map((game) => ({
        id: game.id
    }));
};
exports.cartGamesIdsFn = cartGamesIdsFn;
const cartItems = async (cart) => {
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
    }));
    return games;
};
exports.cartItems = cartItems;
const cartTotalInCents = async (games) => {
    const amount = await games.reduce((acc, game) => {
        return acc + game.price;
    }, 0);
    return Number((amount * 100).toFixed(0));
};
exports.cartTotalInCents = cartTotalInCents;
