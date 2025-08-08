const { default: axios } = require('axios');
import storageConstants from "../../constants/storageConstants";

import EnvConfig from '../EnvConfig';

// creating a pre-configured instance of Axios with custom defaults
const API = axios.create({ baseURL: `${EnvConfig().baseConfigUrl}oms/` });

//passing token as headers
API.interceptors.request.use(async req => {
    const token = await JSON.parse(localStorage.getItem(storageConstants.TOKEN));
    if (token) {
        req.headers.at = token;
    }
    return req;
});

//API calls
export const fetchTimeLine = ({ id }) => API.get(`orders/trackFulfilmentStatus/${id}`);
 
export const fetchOrderDetailsById = ({ id }) => API.get(`orders/order/${id}`);

export const fetchOrdersList = ({ payload }) => API.post(`orders/v3/order-filter`, {
    ...payload,
    // locationId: "RLC_40",
    // loggedInUserId: "42ef64d459f.b48d81b83429283fc96eb25e77ee6980"
});

export const fetchInvoice = ({ id }) => API.get(`orders/invoice/${id}/download`);

export const cancelOrder = ({data}) =>
  API.post(`orders/cancel/order/B2C/${data?.orderId}?user-id=${data?.userId}`);