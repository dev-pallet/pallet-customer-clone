const { default: axios } = require("axios");
const { razorpay } = require("../config/razorpayConfig");
const { createErrorResponse, createResponse } = require("./responseHandler");

const PaymentHandler = {
  async fetchPaymentMethods(req, res) {
    const key = process.env.RAZORPAY_KEY;
    try {
      await axios
        .get(`https://api.razorpay.com/v1/methods?key_id=${key}`)
        .then((response) => {
          res.status(200).send(createResponse(response?.data));
        });
    } catch (error) {
      res
        .status(error?.status || error?.statusCode || 500)
        ?.send(createErrorResponse(error));
    }
  },
  async checkPaymentStatus(req, res) {
    const { orderId } = req.query;
    try {
      razorpay.orders.fetch(orderId).then((payment) => {
        res.status(200).send(createResponse(payment));
      });
    } catch (error) {
      res
        .status(error?.status || error?.statusCode || 500)
        ?.send(createErrorResponse(error));
    }
  },
};
module.exports = { PaymentHandler };
