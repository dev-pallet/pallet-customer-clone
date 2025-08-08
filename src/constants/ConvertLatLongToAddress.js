import axios from "axios";
// import { GEO_API_KEY } from "./storeData";
let node_env = process.env.GEO_API_KEY;

export const extractAddressFromArray = async (arr) => {
  const address = {
    street_address: "",
    city: "",
    state: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    pincode: "",
  };
  await arr.map((e) => {
    e?.types.map((type) => {
      switch (type) {
        case "street_number": {
          return (address.addressLine1 = e?.long_name || e?.short_name);
        }
        case "route": {
          return (address.addressLine1 =
            `${address.addressLine1} ${e?.long_name}` || e?.short_name);
        }
        case "sublocality_level_3": {
          return (address.addressLine1 =
            `${address.addressLine1} ${e?.long_name}` || e?.short_name);
        }
        case "sublocality_level_2": {
          return (address.addressLine2 =
            `${address.addressLine2} ${e?.long_name}` || e?.short_name);
        }
        case "sublocality_level_1": {
          return (address.addressLine2 =
            `${address.addressLine2} ${e?.long_name}` || e?.short_name);
        }
        case "administrative_area_level_1": {
          return (address.state = e?.long_name);
        }
        case "locality": {
          return (address.city = e?.long_name);
        }
        case "country": {
          return (address.country = e?.long_name);
        }
        case "postal_code": {
          return (address.pincode = e?.long_name || e?.short_name);
        }
      }
    });
  });
  return address;
};
export const getAddressFromLatLong = async (lat, long) => {
  let address = {};
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.GEO_API_KEY}`;
    await axios.get(url).then(async (res) => {
      // data = res.data.results;
      const results = res?.data?.results;
      if (results[0]) {
        address = await extractAddressFromArray(results[0]?.address_components);
        address.street_address = results[0]?.formatted_address;
      }
    });
  } catch (e) {}
  return address;
};
