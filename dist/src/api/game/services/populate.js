"use strict";
/**
 * populate service
 */
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require("axios");
const slugify = require("slugify");
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
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
async function setImage({ image, game, field = "cover" }) {
    const url = `https:${image}_bg_crop_1680x655.jpg`;
    const { data } = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(data, "base64");
    const FormData = require("form-data");
    const formData = new FormData();
    formData.append("refId", game.id);
    formData.append("ref", "api::game.game");
    formData.append("field", field);
    formData.append("files", buffer, { filename: `${game.slug}.jpg` });
    console.info(`\n\nUploading ${field} image: ${game.slug}.jpg`);
    await axios({
        method: "POST",
        url: `http://${strapi.config.host}:${strapi.config.port}/api/upload`,
        data: formData,
        headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        }
    });
}
async function createGames(products) {
    await Promise.all(products.map(async (product) => {
        const item = await getByName(product.title, "game");
        if (!item) {
            console.info(`Creating: ${product.title}...`);
            const game = await strapi.entityService.create(`api::game.game`, {
                data: {
                    name: product.title,
                    slug: product.slug.replace(/_/g, "-"),
                    price: product.price.amount,
                    release_date: new Date(Number(product.globalReleaseDate) * 1000).toISOString().split("T")[0],
                    categories: await Promise.all(product.genres.map((name) => getByName(name, "category"))),
                    platforms: await Promise.all(product.supportedOperatingSystems.map((name) => getByName(name, "platform"))),
                    developers: [await getByName(product.developer, "developer")],
                    publisher: await getByName(product.publisher, "publisher"),
                    ...(await getGameInfo(product.slug)),
                }
            });
            await setImage({ image: product.image, game });
            await Promise.all(product.gallery
                .slice(0, 5)
                .map(url => setImage({ image: url, game, field: "gallery" })));
            await timeout(2000);
            return game;
        }
    }));
}
exports.default = () => ({
    async populate(params) {
        const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity`;
        const { data: { products } } = await axios.get(gogApiUrl);
        // console.log(products[0]);
        // await create(products[4].publisher, "publisher");
        // await create(products[4].developer, "developer");
        await createManyToManyData([products[0], products[1], products[2], products[3]]);
        await createGames([products[0], products[1], products[2], products[3]]);
        // console.log(await getGameInfo(products[0].slug))
    }
});
