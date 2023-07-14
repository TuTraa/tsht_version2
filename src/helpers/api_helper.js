import axios from "axios";
import { api } from "../config";
import { logoutUser } from "../store/auth/login/actions";
import { useProfile } from "../Components/Hooks/UserHooks";

// default
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// content type
const token = JSON.parse(localStorage.getItem("authUser"))
  ? JSON.parse(localStorage.getItem("authUser"))["data"]
  : null;
if (token) axios.defaults.headers.common["Authorization"] = "Bearer " + token;

// intercepting to capture errors
axios.interceptors.response.use(
  function (response) {
    if (response.data) {
      if (response.data.status === -9) {
        localStorage.clear();
        window.location.href = "/login";
        return response;
      } else {
        return response.data ? response.data : response;
      }
    }
  },
  function (error) {
    console.log(error);
    localStorage.clear();
    window.location.href = "/login";
    return Promise.reject(error);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};
const setToken = () => {
  const token = JSON.parse(localStorage.getItem("authUser"))
    ? JSON.parse(localStorage.getItem("authUser"))["data"]
    : null;
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */

  //  get = (url, params) => {
  //   return axios.get(url, params);
  // };
  get = (url, params, responseType) => {
    setToken();
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      response = axios.get(
        `${url}?${queryString}`,
        responseType ? { responseType: responseType } : {},
        params
      );
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };
  /**
   * post given data to url
   */
  create = (url, data) => {
    setToken();
    return axios.post(url, data);
  };
  /**
   * post given file to url
   */
  createFile = (url, data, option) => {
    setToken();
    return axios.post(url, data, option);
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    setToken();
    return axios.patch(url, data);
  };

  put = (url, data) => {
    setToken();
    return axios.post(url, data);
  };
  /**
   * Delete
   */
  delete = (url, params) => {
    setToken();
    let response;

    let paramKeys = [];

    if (params) {
      Object.keys(params).map((key) => {
        paramKeys.push(key + "=" + params[key]);
        return paramKeys;
      });

      const queryString =
        paramKeys && paramKeys.length ? paramKeys.join("&") : "";
      response = axios.get(`${url}?${queryString}`, params);
    } else {
      response = axios.get(`${url}`, params);
    }

    return response;
  };
  // del = (url,id) =>{
  //   return axios.delete(url + "?" +id)
  // }
}

const getLoggedinUser = () => {
  const user = localStorage.getItem("authUser");
  if (!user) {
    return null;
  } else {
    return JSON.parse(user);
  }
};

export { APIClient, setAuthorization, getLoggedinUser };
