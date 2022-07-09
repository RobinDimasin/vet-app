import axios from "axios";

export const getBaseURL = () =>
  `${window.location.protocol}//${window.location.host}`;

export const makeApiPostRequest = async (url, data = {}, options = {}) => {
  return await axios.post(getBaseURL() + url, data, options);
};

export const makeApiGetRequest = async (url, options = {}) => {
  return await axios.get(getBaseURL() + url, options);
};

export const getValueFromObject = (obj, key) => {
  const keys = key.split(".");

  if (!obj) {
    return obj;
  }

  if (keys.length === 1) {
    return obj[key];
  } else {
    return getValueFromObject(obj[keys[0]], keys.slice(1).join("."));
  }
};

export const LoadingDial = () => {
  return (
    <div className="text-center">
      <div
        className="radial-progress animate-spin"
        style={{
          "--value": 20,
        }}
      ></div>
    </div>
  );
};
