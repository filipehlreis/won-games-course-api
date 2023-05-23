/**
 * wishlist controller
 */

const utils = require("@strapi/utils");
const { sanitizeEntity } = utils;






import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::wishlist.wishlist');
