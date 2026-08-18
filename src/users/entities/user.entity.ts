import { UserRole } from "../enums/role.enum";

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  avatar_url: string;
  avatar_public_id: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}
