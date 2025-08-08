let node_env = process.env.MY_ENV;

let PAYMENT_PAGE;

if (node_env === "development") {
  PAYMENT_PAGE = `https://dev-signup.palletnow.co`;
  // PAYMENT_PAGE = `http://192.168.200.78:3002`;
}

if (node_env === "stage") {
  PAYMENT_PAGE = `https://stage-signup.palletnow.co`;
}

if (node_env === "production") {
  PAYMENT_PAGE = `https://signup.palletnow.co`;
}

export default PAYMENT_PAGE;
