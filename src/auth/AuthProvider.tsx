import { useEffect, useMemo, useState } from "react";
import { AuthContext, type User } from "./AuthContext";
import { authService, } from '../api/authService';
import type { LoginPayload, RegisterPayload } from "../interfaces/IAuth";
import type { Result } from "../interfaces/ICommons";
import axios from "axios";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  // const login = async (email: string, password: string, rememberMe: boolean,) => {
  //   if (!email || !password) throw new Error("Email y contraseña requeridos");
  //   const fakeToken = "demo-token-" + Math.random().toString(36).slice(2);
  //   const fakeUser = { id: 1, email: email, rememberMe: rememberMe, };
  //   setToken(fakeToken);
  //   setUser(fakeUser);
  //   localStorage.setItem("auth_token", fakeToken);
  //   localStorage.setItem("auth_user", JSON.stringify(fakeUser));
  //   return true;
  // };

  const login = async (data: LoginPayload,) => {
    const response: Result<unknown> = { success: true, data: {}, message: '', };
    try {
      const fakeToken = "demo-token-" + Math.random().toString(36).slice(2);
      const fakeUser = { id: 1, email: data?.email, rememberMe: data?.rememberMe || false, };
      setToken(fakeToken);
      setUser(fakeUser);
      localStorage.setItem("auth_token", fakeToken);
      localStorage.setItem("auth_user", JSON.stringify(fakeUser));
      response.data = { token: fakeToken, user: fakeUser, };
      return response;
    } catch (ex) {
      if (axios.isAxiosError(ex)) {
        response.message = (ex?.response?.data as { detail?: string })?.detail || ex?.message;
      } else if (ex instanceof Error) {
        response.message = ex?.message;
      } else {
        response.message = String(ex);
      }
      return response;
    }
  };

  // const register = async ({ email, password, first_name, last_name, }: { email: string, password: string, first_name: string, last_name: string }) => {
  //   if (!email || !password) throw new Error("Campos requeridos");
  //   return login(email, password, false);
  // };

  const register = async (data: RegisterPayload) => {
    let response: Result<unknown> = { success: true, data: {}, message: '' };
    try {
      await authService.register(data);
      response = await login({ email: data?.email, password: data?.password, });
      return response;
    } catch (ex) {
      response.success = false;
      if (axios.isAxiosError(ex)) {
        response.message = (ex?.response?.data as { detail?: string })?.detail || ex?.message;
      } else if (ex instanceof Error) {
        response.message = `name: ${ex?.name}<br/>`;
        response.message += `cause: ${ex?.cause}<br/>`;
        response.message += `stack: ${ex?.stack}<br/>`;
        response.message += `message: ${ex?.message}<br/>`;
      } else {
        response.message = String(ex);
      }
      return response;
    }
  }

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      token,
      user,
      loading,
      login,
      register,
      logout,
    }),
    [token, user, loading,]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};