import axios from "axios";
import decode from "jwt-decode";
// config
import { HOST_API } from "../config";
// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API || "http://localhost:8080",
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  },
});

const getToken = () => {
  return (
    JSON.parse(localStorage.getItem("recoil-persist"))?.authentication
      ?.accessToken || ""
  );
};

const setToken = (token) => {
  const authLocalData = JSON.parse(localStorage.getItem("recoil-persist"));
  // const authLocalData = useRecoilValue(authState)
  localStorage.setItem(
    "recoil-persist",
    JSON.stringify({
      ...authLocalData,
      authentication: { ...authLocalData.authentication, accessToken: token },
    })
  );
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const now = new Date();
    const payload = getToken() && decode(getToken());

    if (payload && payload.exp * 1000 < now.getTime() && !config._retry) {
      console.log("get token");
      config._retry = true;
      try {
        const res = await axios({
          method: "POST",
          data: {
            _id: payload.sub,
            role: payload.role,
          },
          url: `${HOST_API}/refresh-token`,
          withCredentials: true,
        });
        const newToken = res.data.accessToken;
        setToken(newToken);
      } catch (error) {
        console.log(error);
      }
    }
    config.headers = {
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
    };
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.log("401 error");
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
