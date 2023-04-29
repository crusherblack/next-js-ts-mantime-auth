import { api } from "@/lib/axios";
import { LoginInput } from "@/schemas/login";

export const postLogin = (body: LoginInput) => {
  return api.post("/auth/login", body);
};

export const postRegister = (body: LoginInput) => {
  return api.post("/auth/register", body);
};
