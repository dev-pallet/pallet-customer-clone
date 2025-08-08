const { Router } = require("express");
const { PaymentHandler } = require("../Handlers/PaymentHandler");

const route = Router();

route.get("/fetch-methods", PaymentHandler.fetchPaymentMethods);

module.exports = route;
