import { createContext, } from "react";
import type { IResult } from "../interfaces/ICommons";
import type { ILoginPayload, IRegisterPayload, IUserLogin } from "../interfaces/IAuth";

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: IUserLogin | null;
  loading: boolean;
  login: (data: ILoginPayload,) => Promise<IResult<unknown>>;
  register: (data: IRegisterPayload) => Promise<IResult<unknown>>;
  logout: () => void;
  userUpdate: (user: IUserLogin) => IResult<IUserLogin>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);