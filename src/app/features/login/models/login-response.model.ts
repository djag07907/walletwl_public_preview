export interface LoginData {
  email: string;
  token: string;
  expiration: string;
  role?: string;
  name?: string;
  municipalityId?: string;
}

export interface LoginResponse {
  data: LoginData;
  code: number;
  lang: string;
  message: string;
}
