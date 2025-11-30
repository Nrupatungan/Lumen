// models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;

  // eslint-disable-next-line no-unused-vars
  comparePassword: (candidate: string) => Promise<boolean>;
}

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    emailVerified: { type: Boolean, default: false },
    image: { type: String },
  },
  { timestamps: true }
);

// Hash password before save (pre-save middleware)
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = function (candidate: string) {
  // caller should fetch with `.select("+password")` if using comparePassword on a doc retrieved without password.
  return bcrypt.compare(candidate, this.password as string);
};

// Hide password when converting to JSON
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
