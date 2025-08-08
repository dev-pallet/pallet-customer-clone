const { Router } = require("express");
const { CustomerHandler } = require("../Handlers/CustomerHandler");

const route = Router();

route.post("/create", CustomerHandler.createCustomer);

route.get("/all-tokens/", CustomerHandler.fetchCustomerTokens);

module.exports = route;
