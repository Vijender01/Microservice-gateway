import * as mongoose from 'mongoose';
import { Role } from 'src/common/enums/role.enums';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;  // Removes _id from the transformed object
}

export const TokenSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, 'User can not be empty'],
    },
    token: {
      type: String,
      required: [true, 'Token can not be empty'],
    },
    status: {
      type: String,
      enum: ['valid', 'invalid'], // Restrict the value to valid or invalid
      default: 'valid', // Default status is 'valid'
      required: [true, 'Token status is required'],
    },
    user_role:{
      type: String,
      enum: Role,
      default: "customer",
      required: [true, 'User role is required'],
    }
  },
  {
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
  },
);
