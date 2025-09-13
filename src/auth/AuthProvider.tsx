import { useEffect, useMemo, useState } from "react";
// import { AuthContext, type User } from "./AuthContext";
import { AuthContext, } from "./AuthContext";
import { authService, } from '../api/authService';
import type { ILoginPayload, IRegisterPayload, IUserLogin } from "../interfaces/IAuth";
import type { IResult } from "../interfaces/ICommons";
import axios from "axios";

const lsSettings = {
  user: 'auth_user',
  token: 'auth_token',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<IUserLogin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(lsSettings?.token);
    const savedUser = localStorage.getItem(lsSettings?.user);
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = async (data: ILoginPayload,) => {
    const response: IResult<unknown> = { success: true, data: {}, message: '', };
    try {
      const user = await authService.login({ email: data.email, password: data.password, remember_me: data.remember_me, });
      response.data = user;

      const fakeToken = "demo-token-" + Math.random().toString(36).slice(2);
      setToken(fakeToken);
      setUser(user);

      localStorage.setItem(lsSettings?.token, fakeToken);
      localStorage.setItem(lsSettings?.user, JSON.stringify(user));

      return response;
    } catch (ex) {
      response.success = false;
      if (axios.isAxiosError(ex)) {
        response.message = (ex?.response?.data as { detail?: string })?.detail || ex?.message;
      } else if (ex instanceof Error) {
        response.message = ex?.message;
      } else {
        response.message = String(ex);
      }
      return response;
    }
  }

  const userUpdate = (user: IUserLogin) => {
    const userLogin: IUserLogin = { id: '', first_name: '', last_name: '', email: '', is_deleted: false, created_at: 0, updated_at: 0, };
    const response: IResult<IUserLogin> = { success: true, message: '', data: userLogin, };
    try {
      setUser(user);
      localStorage.setItem(lsSettings?.user, JSON.stringify(user));
      response.data = user;
      return response;
    } catch (ex) {
      response.success = false;
      if (ex instanceof Error) {
        response.message = ex?.message;
      } else {
        response.message = String(ex);
      }
      return response;
    }
  }

  const register = async (data: IRegisterPayload) => {
    let response: IResult<unknown> = { success: true, data: {}, message: '' };
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
    localStorage.removeItem(lsSettings?.token);
    localStorage.removeItem(lsSettings?.user);
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
      userUpdate,
    }),
    [token, user, loading,]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};