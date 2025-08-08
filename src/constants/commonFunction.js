// const CACHE_TTL = 30 * 60 * 1000;
import Cookies from "js-cookie";
import moment from "moment";
// const CACHE_TTL = 30 * 60 * 1000; //setting 30 mints for re-hit api
//setting 30 mints for re-hit api

export const truncateText = (words, maxlength) => {
  return words?.length > maxlength ? `${words?.slice(0, maxlength)} …` : words;
};

export const ScrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

export const toPascalCase = (text) => {
  if (!text) {
    return text;
  }
  if (!isNaN(text)) {
    return text;
  }
  return text.replace(/\w\S*/g, function (word) {
    return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
  });
};

export const calculateInstantDurationTime = (seconds) => {
  const min = Math.floor(Number(seconds / 60));
  const hrs = Math.floor(Number(min) / 60);
  return hrs > 0 ? `${hrs} hr ${min} mins` : `${min} mins`;
};

export const formatDate = (item) => {
  const today = moment().endOf("day");
  const tomorrow = moment().add(1, "day").endOf("day");
  if (moment(item) < today) return "Today";
  if (moment(item) < tomorrow) return "Tomorrow";
  return moment(item)?.format("dddd");
};

export const convertUTC = (utcTime) => {
  // Calculate the UTC time zone offset in minutes
  const utcOffsetMinutes = moment(utcTime).utcOffset();

  return moment(utcTime).add(utcOffsetMinutes, "minutes");
};

export const getAddBtnStyle = (retailType) => ({
  backgroundColor: retailType === "RESTAURANT" ? "#AD1A19" : "#e7f3ec",
  color: retailType === "RESTAURANT" ? "#ffffff" : "#0f8241",
  border:
    retailType === "RESTAURANT"
      ? "1px solid #ffffff"
      : "1px solid rgb(49, 134, 22)",
  position: "relative",
  right: "0.1rem",
  top: "0.2rem",
  width: "6rem",
  borderRadius: "0.5rem",
  padding: "2.5px 8px",
});

// export const getCache = (key) => {
//   // const cached = localStorage.getItem(key);
//   const cachedInCookies = Cookies.get(key);
//   if (!cachedInCookies) return null;

//   try {
//     const { data, timestamp } = JSON.parse(cachedInCookies);

//     // Use moment to check if 30 minutes have passed
//     const now = moment();
//     const cacheTime = moment(timestamp);

//     if (now.diff(cacheTime, "minutes") < 30) {
//       return data;
//     }
//     // localStorage.removeItem(key);
//     Cookies.remove(key);
//     return null;
//   } catch {
//     Cookies.remove(key);
//     // localStorage.removeItem(key);
//     return null;
//   }
// };

// export const setCache = (key, data) => {
//   const cacheObj = {
//     data, // not stringified
//     timestamp: Date.now(),
//   };
//   localStorage.setItem(key, JSON.stringify(cacheObj));
// };

// export function setCache(key, value) {

//   const payload = JSON.stringify(value);

//   Cookies.set(key, payload, {
//     expires: moment().add(1, "minute").toDate(), // Browser handles expiration
//     path: "/",
//     // secure: process.env.NODE_ENV === "production",
//     sameSite: "Lax",
//   });
// }

export function setCache(key, value) {
  const expiresAt = moment().add(1, "minute").toISOString();
  Cookies.set(key, JSON.stringify({ data: 123, expiresAt }), { path: "/" });
}

// Get cache from cookies
export function getCache(key) {
  const value = Cookies.get(key);
  try {
    const { data, expiresAt } = JSON.parse(value);
    if (moment().isAfter(moment(expiresAt))) {
      Cookies.remove(key);
      return null; // expired
    }
    return data;
  } catch {
    return null;
  }
  // return value ? JSON.parse(value) : null;
}

export const formatDateTime = (date, format = "DD-MMM-YYYY", isUTC = true) => {
  if (!date) return "";
  const m = isUTC ? convertUTC(date) : moment(date);
  return m.format(format);
};
