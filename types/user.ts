export interface UserDB {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | boolean | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  role: string;
  bio: string | null;
  website: string | null;
  location: string | null;
  // Add any other fields your User model has
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: string | boolean | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  banned: boolean | null;
  banReason: string | null;
  banExpires: string | null;
  role: string;
  bio: string | null;
  website: string | null;
  location: string | null;
  // Add any other fields that match the converted user
}
