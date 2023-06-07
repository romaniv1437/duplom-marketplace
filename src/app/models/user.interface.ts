export interface UserModel extends User {
  first_name: string;
  last_name: string;
  tokens: { access: string, refresh: string }
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  imageFile: File;
  avatar: string;
}
