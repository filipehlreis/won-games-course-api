"use strict";
/**
 * populate service
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    async populate(params) {
        const cat = await strapi.service('api::category.category').find({ name: "Action" });
        console.log(cat);
    }
});
