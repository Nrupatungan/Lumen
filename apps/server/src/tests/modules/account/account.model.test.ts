import {
  describe,
  beforeAll,
  afterAll,
  expect,
  test,
  beforeEach,
} from "vitest";
import mongoose, { Schema, Model, Document } from "mongoose";
import { setupTestDB, teardownTestDB, clearDatabase } from "../../setup.js";
import { Account, IAccount } from "@repo/db";

// ----------------------------------------------------
// Mock User Model Setup
// ----------------------------------------------------

interface IMockUser extends Document {
  email: string;
}
const MockUserSchema = new Schema<IMockUser>({
  email: { type: String, required: true, unique: true },
});
let MockUser: Model<IMockUser>;
try {
  MockUser = mongoose.model<IMockUser>("User");
} catch {
  MockUser = mongoose.model<IMockUser>("User", MockUserSchema);
}

let testUserId: mongoose.Types.ObjectId;
// FIX: Move baseAccountData declaration to the global scope
let baseAccountData: {
  userId: mongoose.Types.ObjectId;
  provider: string;
  providerAccountId: string;
};

// ----------------------------------------------------
// Database Hooks
// ----------------------------------------------------

beforeAll(async () => {
  await setupTestDB();
});

beforeEach(async () => {
  // FIX: Clear the entire database and then RE-CREATE the mock user dependency
  await clearDatabase();

  // Ensure the mock user exists and assign its ID
  const user = await MockUser.create({
    email: "account_test_user@example.com",
  });
  testUserId = user._id;

  // FIX: Initialize baseAccountData with the correct testUserId
  baseAccountData = {
    userId: testUserId,
    provider: "github",
    providerAccountId: "12345",
  };
});

afterAll(async () => {
  await teardownTestDB();
});

// ----------------------------------------------------
// Account Model Tests (Minimal Focus)
// ----------------------------------------------------

describe("Account Model Persistence (Minimal Fields)", () => {
  // REMOVED: baseAccountData declaration is now in the global scope

  test("should successfully create and save a new account with minimal data", async () => {
    const validAccount = new Account(baseAccountData);
    const savedAccount = await validAccount.save();

    expect(savedAccount._id).toBeDefined();
    expect(savedAccount.userId).toEqual(testUserId);
    expect(savedAccount.provider).toBe("github");
    expect(savedAccount.providerAccountId).toBe("12345");
    expect(savedAccount.type).toBe("oauth");

    // Verify that the optional token fields are not set (undefined)
    expect(savedAccount.access_token).toBeUndefined();
    expect(savedAccount.refresh_token).toBeUndefined();
    expect(savedAccount.id_token).toBeUndefined();
    expect(savedAccount.expires_at).toBeUndefined();

    expect(savedAccount.createdAt).toBeDefined();
  });

  // --- Required Field Validation Tests ---

  // NOTE: This test should now pass without the brittle error, as baseAccountData.userId is valid.
  test("should fail to save if providerAccountId is missing", async () => {
    const data = { ...baseAccountData, providerAccountId: undefined };
    const account = new Account(data as unknown as IAccount);
    await expect(account.save()).rejects.toThrow(
      /Account validation failed: providerAccountId: Path `providerAccountId` is required/
    );
  });

  // --- Unique Compound Index Tests ---

  test("should fail to save if provider and providerAccountId pair is duplicated", async () => {
    // 1. Save the first account successfully
    await Account.create(baseAccountData);

    // 2. Attempt to save a second account with the same compound key
    const secondAccount = new Account({
      userId: testUserId,
      provider: "github",
      providerAccountId: "12345",
    });

    await expect(secondAccount.save()).rejects.toThrow();

    try {
      await secondAccount.save();
    } catch (error) {
      const mongoErr = error as mongoose.mongo.MongoServerError;
      expect(mongoErr.code).toBe(11000);
    }
  });

  test("should succeed if accounts have the same provider but different providerAccountId", async () => {
    // Account 1
    await Account.create({ ...baseAccountData, providerAccountId: "111" });

    // Account 2: Different account ID
    const uniqueAccount = new Account({
      ...baseAccountData,
      providerAccountId: "222",
    });

    await expect(uniqueAccount.save()).resolves.toBeDefined();
  });

  test("should succeed if accounts have the same providerAccountId but different provider", async () => {
    // Account 1
    await Account.create({ ...baseAccountData, provider: "github" });

    // Account 2: Different provider
    const uniqueAccount = new Account({
      ...baseAccountData,
      provider: "gitlab",
      providerAccountId: baseAccountData.providerAccountId, // Use the base account ID for consistency
    });

    await expect(uniqueAccount.save()).resolves.toBeDefined();
  });
});
