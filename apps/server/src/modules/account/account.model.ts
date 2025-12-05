// src/user/account.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  provider: string;
  providerAccountId: string;
  type: string;

  access_token?: string;
  refresh_token?: string;
  id_token?: string;
  expires_at?: number;
}

const accountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    type: { type: String, default: "oauth" },

    access_token: String,
    refresh_token: String,
    id_token: String,
    expires_at: Number,
  },
  { timestamps: true }
);

accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

const Account: Model<IAccount> =
  mongoose.models.Account ||
  mongoose.model<IAccount>("Account", accountSchema);

export default Account;
