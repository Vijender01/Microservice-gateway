import { Role } from "src/common/enums/role.enums";

export interface IUser {
    id: string;
    email: string;
    role?: Role;
  }
  