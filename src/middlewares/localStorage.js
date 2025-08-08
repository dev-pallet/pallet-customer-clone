export const storeData = async (key, data) => {
  const jsonData = await JSON.stringify(data);
  await localStorage.setItem(key, jsonData);
};

export const storePlainData = async (key, value) => {
  if (typeof value !== "string") {
    return;
  }
  localStorage.setItem(key, value);
};

export const getAsyncStorageData = async (key) => {
  const jsonData = await JSON.parse(localStorage.getItem(key));
  return jsonData != null ? jsonData : null;
};

export const removeData = async (key) => {
  await localStorage.removeItem(key);
};
