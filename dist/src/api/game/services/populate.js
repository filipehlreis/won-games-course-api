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
    const item = await strapi.entityService.findMany(`api::${entityName}.${entityName}`, {
        fields: ['name'],
        filters: { name: name },
        sort: 'name',
    });
    return item.length ? item[0] : null;
}
async function create(name, entityName) {
    const item = await getByName(name, entityName);
    if (!item) {
        return await strapi.entityService.create(`api::${entityName}.${entityName}`, {
            data: {
                name,
                slug: slugify(name, { lower: true }),
            }
        });
    }
}
async function createManyToManyData(products) {
    const developers = {};
    const publishers = {};
    const categories = {};
    const platforms = {};
    products.forEach((product) => {
        const { developer, publisher, genres, supportedOperatingSystems } = product;
        genres && genres.forEach((item) => {
            categories[item] = true;
        });
        supportedOperatingSystems && supportedOperatingSystems.forEach((item) => {
            platforms[item] = true;
        });
        developers[developer] = true;
        publishers[publisher] = true;
    });
    return Promise.all([
        ...Object.keys(developers).map((name) => create(name, "developer")),
        ...Object.keys(publishers).map((name) => create(name, "publisher")),
        ...Object.keys(categories).map((name) => create(name, "category")),
        ...Object.keys(platforms).map((name) => create(name, "platform")),
    ]);
}
exports.default = () => ({
    async populate(params) {
        const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity`;
        const { data: { products } } = await axios.get(gogApiUrl);
        // console.log(products[0]);
        // await create(products[4].publisher, "publisher");
        // await create(products[4].developer, "developer");
        await createManyToManyData([products[7], products[8], products[9]]);
        // console.log(await getGameInfo(products[0].slug))
    }
});
