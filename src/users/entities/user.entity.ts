export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  avatar_url: string;
  avatar_public_id: string;
  created_at: Date;
  updated_at: Date;
}
