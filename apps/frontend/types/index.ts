export type TUserRole = "STUDENT" | "ALUMNI" | "ADMIN" | "SUPER_ADMIN";

export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: TUserRole;
  profilePicture?: string;
  universityId?: string;
  bio?: string;
  isVerified: boolean;
  isActive: boolean;
  followers: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload {
  username: string;
  email: string;
  password: string;
  role: TUserRole;
  universityId?: string;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    unreadCount?: number;
  };
}
