import axios from "axios";

export const getBaseURL = () =>
  `${window.location.protocol}//${window.location.host}`;

export const makeApiPostRequest = async (url, data = {}, options = {}) => {
  return await axios.post(getBaseURL() + url, data, options);
};

export const makeApiGetRequest = async (url, options = {}) => {
  return await axios.get(getBaseURL() + url, options);
};
