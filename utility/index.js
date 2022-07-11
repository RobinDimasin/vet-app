import axios from "axios";
import moment from "moment";

export const getBaseURL = () =>
  `${window.location.protocol}//${window.location.host}`;

export const makeApiPostRequest = async (url, data = {}, options = {}) => {
  return await axios.post(getBaseURL() + url, data, options);
};

export const makeApiGetRequest = async (url, options = {}) => {
  return await axios.get(getBaseURL() + url, options);
};

export const getValueFromObject = (obj, key) => {
  if (!key) {
    return null;
  }

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

const valueFormatters = {
  created_at: (v) => moment(v).format("LLL"),
  birthdate: (v) => moment(v).format("MMMM Do YYYY"),
};

const keyFormatters = {
  created_at: () => "Created",
  account_id: () => "Account ID",
  id: () => "ID",
  license_no: () => "License Number",
};

export const makeProperty = (key, obj, format = {}) => {
  const { value: valueFormatter, key: keyFormatter } = format;

  return obj && obj[key] ? (
    <p className="break-words">
      <b>
        {keyFormatter
          ? keyFormatter(key)
          : keyFormatters[key]
          ? keyFormatters[key](key)
          : key
              .replaceAll("_", " ")
              .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
        :{" "}
      </b>
      {valueFormatter
        ? valueFormatter(obj[key])
        : valueFormatters[key]
        ? valueFormatters[key](obj[key])
        : obj[key]}
    </p>
  ) : null;
};

export const makeName = ({ first_name, last_name, middle_name }) => {
  return `${last_name}, ${first_name}${middle_name ? " " + middle_name : ""}`;
};
