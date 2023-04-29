import axios from "axios";
import { getCookie } from "cookies-next";
import cookie from "cookie";
import { GetServerSidePropsContext } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getCookie("token");

    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const serverApi = (ctx: GetServerSidePropsContext) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      Accept: "application/json",
      cookie: ctx?.req?.headers?.cookie ? ctx.req.headers.cookie : undefined,
      Authorization: ctx?.req?.headers?.cookie
        ? `Bearer ${cookie.parse(ctx?.req.headers.cookie).token}`
        : undefined,
    },
  });
};
