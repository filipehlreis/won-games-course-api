/**
 * populate service
 */

const axios = require("axios");
const slugify = require("slugify");

async function getGameInfo(slug){
  const jsdom = require("jsdom");
  const {JSDOM} = jsdom;
  const body = await axios.get(`https://www.gog.com/en/game/${slug}`);
  const dom = new JSDOM(body.data);

  const description = dom.window.document.querySelector('.description');

  return {
    rating: 'BR0',
    short_description: description.textContent.slice(0,160),
    description: description.innerHTML
  };
}

async function getByName(name, entityName){
  const item = await strapi.entityService.findMany(`api::${entityName}.${entityName}`,{
    fields: ['name'],
    filters: { name : name },
    sort: 'name',
  })
  return item.length ? item[0] : null;
}

async function create(name, entityName){
  const item = await getByName(name, entityName);

  if(!item){
    return await strapi.entityService.create(`api::${entityName}.${entityName}`, {
      data: {
        name,
        slug: slugify(name, {lower:true}),
      }
    })
  }
}


export default () => ({
  async populate(params) {
    // const gogApiUrl = `https://catalog.gog.com/v1/catalog?limit=48&order=desc%3Atrending&productType=in%3Agame%2Cpack%2Cdlc%2Cextras&page=1&countryCode=BR&locale=en-US&currencyCode=BRL`
    const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity`;

    const {data:{products}} = await axios.get(gogApiUrl);

    // console.log(products[0]);

    await create(products[4].publisher,"publisher");
    await create(products[4].developer,"developer");

    // console.log(await getGameInfo(products[0].slug))
  }
});
