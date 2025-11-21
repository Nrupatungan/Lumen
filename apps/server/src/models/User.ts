import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
  },
  { timestamps: true }
);

export const User = model('User', UserSchema);
