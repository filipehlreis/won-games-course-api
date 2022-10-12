/**
 * populate service
 */

export default () => ({
  async populate(params) {
    const cat = await strapi.service('api::category.category').find({name: "Action"})
    console.log(cat)
  }
});
