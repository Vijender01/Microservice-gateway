import { Document } from 'mongoose';
import { Role } from 'src/common/enums/role.enums';

export interface IToken extends Document {
  user_id: string;
  user_role: Role;
  token: string;
}
