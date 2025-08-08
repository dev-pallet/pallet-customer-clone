let node_env = process.env.MY_ENV;

let hostname = window.location.hostname;

let STORE_DATA;
if (node_env === "development") {
  if (
    hostname.includes("webapp-dev") ||
    hostname.includes("localhost") ||
    hostname.includes("dev-grocery.palletnow.co") ||
    hostname.includes("dev-restaurant.palletnow.co")
  ) {
    // STORE_DATA = { id: "RET_39", locId: "RLC_40" };
    // STORE_DATA = { id: "RET_82", locId: "RLC_83" };

    STORE_DATA = { id: "RET_360", locId: "RLC_361" };
  }
}

if (node_env === "stage") {
  if (
    hostname.includes("twinleaves") ||
    hostname.includes("webapp-ui-stage") ||
    hostname.includes("webapp-stage") ||
    hostname.includes("stage-grocery.palletnow.co") ||
    hostname.includes("stage-restaurant.palletnow.co")
  ) {
    // STORE_DATA = { id: "RET_82", locId: "RLC_83" };
    STORE_DATA = { id: "RET_360", locId: "RLC_361" };
  }
}
if (node_env === "production") {
  // Assuming production
  STORE_DATA = { id: "RET_161", locId: "RLC_162" };
}
export default STORE_DATA;
