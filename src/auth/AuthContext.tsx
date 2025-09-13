import { createContext, } from "react";
import type { Result } from "../interfaces/ICommons";
import type { LoginPayload, RegisterPayload, User } from "../interfaces/IAuth";

// export interface User {
//   id: number;
//   email: string;
//   first_name: string;
//   last_name: string;
//   remember_me: boolean;
// }

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;
  // login: (email: string, password: string, remember_me: boolean,) => Promise<boolean>;
  login: (data: LoginPayload,) => Promise<Result<unknown>>;
  //register: (data: { email: string; password: string, first_name: string, last_name: string, }) => Promise<boolean>;
  register: (data: RegisterPayload) => Promise<Result<unknown>>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [token, setToken] = useState<string | null>(null);
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const savedToken = localStorage.getItem("auth_token");
//     const savedUser = localStorage.getItem("auth_user");
//     if (savedToken) setToken(savedToken);
//     if (savedUser) setUser(JSON.parse(savedUser));
//     setLoading(false);
//   }, []);

//   const login = async (email: string, password: string) => {
//     if (!email || !password) throw new Error("Email y contraseña requeridos");
//     const fakeToken = "demo-token-" + Math.random().toString(36).slice(2);
//     const fakeUser = { id: 1, email };
//     setToken(fakeToken);
//     setUser(fakeUser);
//     localStorage.setItem("auth_token", fakeToken);
//     localStorage.setItem("auth_user", JSON.stringify(fakeUser));
//     return true;
//   };

//   const register = async ({ email, password }: { email: string; password: string }) => {
//     if (!email || !password) throw new Error("Campos requeridos");
//     return login(email, password);
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem("auth_token");
//     localStorage.removeItem("auth_user");
//   };

//   const value = useMemo(
//     () => ({
//       isAuthenticated: Boolean(token),
//       token,
//       user,
//       loading,
//       login,
//       register,
//       logout,
//     }),
//     [token, user, loading]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = (): AuthContextType => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
//   return ctx;
// };