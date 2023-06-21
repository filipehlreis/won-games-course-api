// path: ./src/api/restaurant/routes/01-custom-restaurant.js

export default {
  routes: [
    { // Path defined with an URL parameter
      method: 'POST',
      path: '/orders/create-payment-intent',
      handler: 'order.createPaymentIntent',
    }
  ]
}

