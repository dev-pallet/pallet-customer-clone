import axios from "axios";

const API = axios.create({ baseURL: "/api/" });
API.interceptors.request.use((req) => {
  return req;
});


//order API
export const createOrder = (data) => API.post(`orders/create`, data);
//payment API
export const fetchAllMethods = () => API.get(`payments/fetch-methods`);
export const checkPaymentStatus = (id) =>
  API.get(`payments/check/status/?orderId=${id}`);

//card API
export const fetchCustomerTokens = (data) =>
  API.get(`customer/all-tokens/?id=${data?.id}`);

//customer API

export const 
createRazorpayCustomer = (data) => API.post(`customer/create`, data);

