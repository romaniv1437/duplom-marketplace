export interface UserModel extends User {
  first_name: string;
  last_name: string;
  avatar: string;
  tokens: { access: string, refresh: string, life_access: string }
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  imageFile: File;
  profilePicture: string;
}
