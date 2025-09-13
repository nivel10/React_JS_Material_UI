import type { ILoginPayload, IRegisterPayload } from "../interfaces/IAuth";
import httpClient from "./httpClient";

export const authService = {
  login: async (data: ILoginPayload) => {
    const res = await httpClient.post("/auth/login", data);
    return res.data; // { token, user }
  },

  register: async (data: IRegisterPayload) => {
    const res = await httpClient.post("/auth/register", data);
    return res.data; // { token, user }
  },

  logout: async () => {
    await httpClient.post("/auth/logout");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  },
};