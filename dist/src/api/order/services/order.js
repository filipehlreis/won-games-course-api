"use strict";
/**
 * order service
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplateOrder = void 0;
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreService('api::order.order');
const subject = 'Order at Won Games';
const text = `
Hi <%= user.username %>, thanks for buying at Won Games!!!
Follow the info of your order:

Card Information:
Card brand: <%= payment.card_brand %>
Card number: **** **** **** <%= payment.card_last4 %>

Total: <%= payment.total %>

Games:

<% _.forEach(games, function(game) { %>
  <%= game.name %> - Price: $<%= game.price %>
<% }); %>
`;
const html = `
<p>Hi <%= user.username %>, thanks for buying at Won Games!</p>
<p>Follow the info of your order:</p>
<h3>Card Information</h3>
<ul>
  <li><strong>Card brand:</strong> <%= payment.card_brand %></li>
  <li><strong>Card number:</strong> **** **** **** <%= payment.card_last4 %></li>
</ul>
<h3>Total: <%= payment.total %></h3>
<hr />
<h3>Games</h3>
<ul>
  <% _.forEach(games, function(game) { %>
    <li><a href="http://localhost:3000/game/<%= game.slug %>"><%= game.name %></a> - Price: <strong>$<%= Number(game.price).toFixed(2) %></strong></li>
  <% }); %>
</ul>
`;
exports.emailTemplateOrder = {
    subject,
    text,
    html,
};
