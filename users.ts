export enum Role {
  SuperAdmin = "superadmin",
  Admin = "admin",
  Subscriber = "subscriber",
}

export interface User {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCRUD<T> {
  create(user: T): void;
  read(): T[];
  update(user: T): void;
  delete(id: number): void;
}
