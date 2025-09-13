export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  // first_name: string;
  // last_name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}