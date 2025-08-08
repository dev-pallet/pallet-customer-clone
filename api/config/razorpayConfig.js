const Razorpay = require("razorpay");

// Define API routes here

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});
module.exports = { razorpay };
