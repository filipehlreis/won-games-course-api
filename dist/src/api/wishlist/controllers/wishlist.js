"use strict";
/**
 * wishlist controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("@strapi/utils");
const { sanitizeEntity } = utils;
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::wishlist.wishlist');
