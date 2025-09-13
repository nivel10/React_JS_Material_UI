export interface ILoginPayload {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface IRegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface IUserLogin {
  id: string;
  first_name: string;
  last_name: string;
  email: string
  is_deleted: boolean;
  created_at: number;
  updated_at: number;
}