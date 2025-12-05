// models/user.model.ts
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name?: string;
  email?: string;
  password?: string;
  role: "admin" | "user";
  emailVerified?: Date | null;
  image?: string;

  createdAt: Date;
  updatedAt: Date;

  // eslint-disable-next-line no-unused-vars
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, select: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    emailVerified: { type: Date },
    image: { type: String },
  },
  { timestamps: true }
);

/* 🔐 Password Hashing */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS) || 10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/* 🔐 Compare Password */
UserSchema.methods.comparePassword = function (password: string) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
