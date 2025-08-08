const { razorpay } = require("../config/razorpayConfig");
const { createErrorResponse, createResponse } = require("./responseHandler");

const OrderHandler = {
  async createOrder(req, res) {
    const body = req.body;
    try {
      razorpay.orders
        .create({
          customer_id: body?.custId,
          amount: body?.amount * 100,
          currency: "INR",
          receipt: body?.cartId,
        })
        .then((order) => {
          res.status(200).send(createResponse(order));
        });
    } catch (error) {
      res.status(error?.status || 500).send(createErrorResponse(error));
    }
  },
};
module.exports = { OrderHandler };
