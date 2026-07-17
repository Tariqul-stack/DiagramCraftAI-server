import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string | null;
  avatar?: string;
  provider: 'email' | 'google';
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
    },
    provider: {
      type: String,
      enum: ['email', 'google'],
      default: 'email',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);
