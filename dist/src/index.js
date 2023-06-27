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
                            // return true;
                            const contexto = context;
                            // console.info(
                            //   'dentro do useeffect info para o wishlistItems >>>>>>',
                            //   JSON.stringify(context, null, 2),
                            // );
                            console.log('contexto do ', context);
                            console.log('contexto do contexto ', context.context);
                            console.log('state do contexto do contexto ', context.context.state);
                            console.log('koaContext do contexto do contexto ', context.context.koaContext);
                            console.log('state do contexto ', context.state);
                            console.log('strategy do contexto ', await context.state.auth.strategy);
                            console.log('http do contexto ', context.http);
                            // console.log('teste do teste')
                            // console.log(context.context.state)
                            // // const { id } = context.state.user;
                            // console.log('context.state.user >>>>>', await context.context.state.user)
                            // const token = await strapi.plugins['users-permissions'].service
                            // console.log('tokeeeeen >>> ', token)
                            const emailContext = context.context.state.user.email;
                            console.log(emailContext);
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
                },
                'Mutation.updateWishlist': {
                    policies: [
                        async (context) => {
                            const emailContext = context.context.state.user.email;
                            console.log(emailContext);
                            const isThereAnId = await strapi.db.query('api::wishlist.wishlist').findOne({
                                filters: { user: { email: emailContext } }
                            }) || false;
                            if (!isThereAnId)
                                return false;
                            context.args.id = isThereAnId.id;
                            context.args.data.user = context.context.state.user.id;
                            return true;
                        }
                    ]
                },
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
