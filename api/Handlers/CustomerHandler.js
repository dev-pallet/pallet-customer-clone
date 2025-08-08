const { razorpay } = require("../config/razorpayConfig");
const { createResponse, createErrorResponse } = require("./responseHandler");

const CustomerHandler = {
  async createCustomer(req, res) {
    try {
      const body = req.body;
      await razorpay.customers
        .create({ ...body, fail_existing: "0" })
        .then((customer) => {
          if (customer) {
            res.status(200).send(createResponse(customer));
          } else res.status(200).send(createResponse(null));
        });
    } catch (error) {
      res
        .status(200)
        .send(
          createErrorResponse({ data: null, message: "Customer Not Found" })
        );
    }
  },

  async fetchCustomerTokens(req, res) {
    const { id } = req.query;
    try {
      await razorpay.customers.fetchTokens(id).then((token) => {
        if (token) {
          res.status(200).send(createResponse(token));
        } else {
          res.status(200).send(createResponse({ message: "No tokens found" }));
        }
      });
    } catch (error) {
      res
        .status(error?.code || error?.status || 500)
        .send(createErrorResponse(error));
    }
  },
};
module.exports = { CustomerHandler };
