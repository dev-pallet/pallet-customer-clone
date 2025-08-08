import { jwtDecode } from "jwt-decode";
const pako = require("pako");

const ExtractDataFromGzip = async (token) => {
  const decodedToken = await jwtDecode(token);
  const decodedTokenPayload = decodedToken.payload;
  const binaryString = atob(decodedTokenPayload);

  // Convert binary string to Uint8Array
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  // Decompress using pako
  const pako = require("pako");
  const inflatedData = pako.inflate(uint8Array, { to: "string" });
  return inflatedData;
};

export default ExtractDataFromGzip;
