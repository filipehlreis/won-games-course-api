export const cartGamesIdsFn = async (cart) => {
  return await cart.map((game) => ({
    id: game.id
  }))
}



export const cartItems = async (cart) => {
  let games = []

  // await strapi.entityService.findMany(`api::${entityName}.${entityName}`, {
  //   fields: ['name'],
  //   filters: { name: name },
  //   sort: 'name',
  // })

  await Promise.all(
    cart?.map(async (game) => {
      const validatedGame = await strapi.entityService.findOne('api::game.game', game.id
        , {});
      if (validatedGame) {
        games.push(validatedGame);
      }
    })
  )

  return games;
}

export const cartTotalInCents = async (games) => {
  const amount = await games.reduce((acc, game) => {
    return acc + game.price
  }, 0)

  return Number((amount * 100).toFixed(0))
}
