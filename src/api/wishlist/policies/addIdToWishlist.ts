/**
 * addIdToWishlist policy
 */

export default (policyContext, config, { strapi }) => {
  // Add your own logic here.
  strapi.log.info('In addIdToWishlist policy.');

  console.log("testes>>>>>>>>>>>>", policyContext.createWishlist)
  const canDoSomething = true;

  if (canDoSomething) {
    return true;
  }

  return false;
};
