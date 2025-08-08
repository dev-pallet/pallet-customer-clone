const { Router } = require("express");
const { razorpay } = require("./config/razorpayConfig");
const CustomerRoutes = require("./Providers/CustomerProvider");
const OrderRoutes = require("./Providers/OrderProvider");
const PaymentRoutes = require("./Providers/PaymentProvider");

const apiRoute = Router();

// Define API routes here
apiRoute.use("/customer", CustomerRoutes);
apiRoute.use("/payments", PaymentRoutes);
apiRoute.use("/orders", OrderRoutes);

module.exports = apiRoute;
