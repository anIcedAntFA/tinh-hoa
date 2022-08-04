import axios from "axios";
export const createProduct = (data, options) => {
  return axios({
    method: "POST",
    url: "http://localhost:3000/api/create-product",
    data,
    ...options,
  });
};
