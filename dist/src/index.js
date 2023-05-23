"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register({ strapi }) {
        const extensionService = strapi.plugin('graphql').service('extension');
        extensionService.use({
            resolversConfig: {
                'Mutation.createWishlist': {
                    policies: [
                        async (context) => {
                            const emailContext = context.context.state.user.email;
                            const isThereAnId = await strapi.db.query('api::wishlist.wishlist').findOne({
                                filters: { user: { email: emailContext } }
                            }) || false;
                            if (isThereAnId) {
                                return false;
                            }
                            ;
                            context.args.data.user = context.context.state.user.id;
                            return true;
                        }
                    ]
                }
            }
        });
    },
    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    bootstrap( /*{ strapi }*/) { },
};
/*
https://catalog.gog.com/v1/catalog?limit=48&releaseStatuses=in:upcoming&order=desc:trending&productType=in:game,pack,dlc,extras&page=1&countryCode=REST&locale=en-US&currencyCode=USD
releaseStatuses=upcoming
 curl -X POST http://localhost:1337/api/game/populate\?availability\=coming\&sort\=trending\&limit\=48\&page\=3
*/
