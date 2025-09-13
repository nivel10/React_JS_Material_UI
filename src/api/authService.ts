import type { LoginPayload, RegisterPayload } from "../interfaces/IAuth";
import httpClient from "./httpClient";

export const authService = {
  login: async (data: LoginPayload) => {
    const res = await httpClient.post("/auth/login", data);
    return res.data; // { token, user }
  },

  register: async (data: RegisterPayload) => {
    const res = await httpClient.post("/auth/register", data);
    return res.data; // { token, user }
  },

  logout: async () => {
    await httpClient.post("/auth/logout");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },
};