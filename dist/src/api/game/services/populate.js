"use strict";
/**
 * populate service
 */
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require("axios");
const slugify = require("slugify");
async function getGameInfo(slug) {
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const body = await axios.get(`https://www.gog.com/en/game/${slug}`);
    const dom = new JSDOM(body.data);
    const description = dom.window.document.querySelector('.description');
    return {
        rating: 'BR0',
        short_description: description.textContent.slice(0, 160),
        description: description.innerHTML
    };
}
async function getByName(name, entityName) {
    // const item = await strapi.entityService.findMany()
    const item = await strapi.services[entityName].find({ name });
    return item.length ? item[0] : null;
}
exports.default = () => ({
    async populate(params) {
        // const gogApiUrl = `https://catalog.gog.com/v1/catalog?limit=48&order=desc%3Atrending&productType=in%3Agame%2Cpack%2Cdlc%2Cextras&page=1&countryCode=BR&locale=en-US&currencyCode=BRL`
        const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity`;
        const { data: { products } } = await axios.get(gogApiUrl);
        console.log(products[0]);
        console.log(await getByName(products[0].publisher, "publisher"));
        // await strapi.entityService.create('api::publisher.publisher', {
        //   data:{
        //     name: products[0].publisher,
        //     slug: slugify(products[0].publisher).toLowerCase(),
        //   }
        // });
        // await strapi.entityService.create('api::developer.developer', {
        //   data:{
        //     name: products[0].developer,
        //     slug: slugify(products[0].developer).toLowerCase(),
        //   }
        // });
        // console.log(await getGameInfo(products[0].slug))
    }
});
