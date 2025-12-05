import mongoose, { Schema, Document } from "mongoose";

export interface IVerificationToken extends Document {
  identifier?: string;
  token: string;
  expires: Date;

  // FIX: Added timestamps to the interface
  createdAt: Date;
  updatedAt: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
  {
    identifier: { type: String }, // email
    token: { type: String, unique: true, required: true },
    expires: { type: Date, required: true },
  },
  { timestamps: true }
);

VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });

export const VerificationToken = mongoose.model<IVerificationToken>(
  "VerificationToken",
  VerificationTokenSchema
);
