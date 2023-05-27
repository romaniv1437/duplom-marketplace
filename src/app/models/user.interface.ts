export interface UserModel extends User{
  tokens: { access: string, refresh: string }
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
