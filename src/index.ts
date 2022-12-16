export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};



/*
https://catalog.gog.com/v1/catalog?limit=48&releaseStatuses=in:upcoming&order=desc:trending&productType=in:game,pack,dlc,extras&page=1&countryCode=REST&locale=en-US&currencyCode=USD
releaseStatuses=upcoming
 curl -X POST http://localhost:1337/api/game/populate\?availability\=coming\&sort\=trending\&limit\=48\&page\=3
*/
