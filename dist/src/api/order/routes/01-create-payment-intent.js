"use strict";
// path: ./src/api/restaurant/routes/01-custom-restaurant.js
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/orders/create-payment-intent',
            handler: 'order.createPaymentIntent',
        }
    ]
};
