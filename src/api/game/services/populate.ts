/**
 * populate service
 */

const axios = require("axios");


export default () => ({
  async populate(params) {
    // const gogApiUrl = `https://catalog.gog.com/v1/catalog?limit=48&order=desc%3Atrending&productType=in%3Agame%2Cpack%2Cdlc%2Cextras&page=1&countryCode=BR&locale=en-US&currencyCode=BRL`
    const gogApiUrl = `https://www.gog.com/games/ajax/filtered?mediaType=game&page=1&sort=popularity`

    const {data:{products}} = await axios.get(gogApiUrl)

    console.log(products[0])
  }
});
