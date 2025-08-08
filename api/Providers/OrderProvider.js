const { Router } = require("express");
const { PaymentHandler } = require("../Handlers/PaymentHandler");
const { OrderHandler } = require("../Handlers/OrderHandler");

const route = Router();

route.post("/create", OrderHandler.createOrder);

module.exports = route;
