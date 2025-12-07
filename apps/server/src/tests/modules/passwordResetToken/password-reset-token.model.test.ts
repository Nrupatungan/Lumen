import {
  describe,
  beforeAll,
  afterAll,
  expect,
  test,
  beforeEach,
} from "vitest";
import mongoose, { Schema, Model, Document } from "mongoose";
import { setupTestDB, teardownTestDB, clearDatabase } from "../../setup.js"; // Assuming utilities path
import { IPasswordResetToken, PasswordResetToken } from "@repo/db";

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

// FIX: Move baseTokenData declaration to the global scope
let baseTokenData: {
  userId: mongoose.Types.ObjectId;
  token: string;
  expires: Date;
};

// ----------------------------------------------------
// Database Hooks
// ----------------------------------------------------

beforeAll(async () => {
  await setupTestDB();
});

beforeEach(async () => {
  // FIX: Clear the database and then RE-CREATE the mock user dependency
  await clearDatabase();

  // Re-create the mock user after clearing the database
  const user = await MockUser.create({
    email: "reset_token_test_user@example.com",
  });
  testUserId = user._id;

  // FIX: Initialize or update baseTokenData within beforeEach
  baseTokenData = {
    userId: testUserId,
    token: "reset-token-abc-123",
    expires: new Date(Date.now() + 3600000), // 1 hour from now
  };
});

afterAll(async () => {
  await teardownTestDB();
});

// ----------------------------------------------------
// PasswordResetToken Model Tests
// ----------------------------------------------------

describe("PasswordResetToken Model Validation and Indexing", () => {
  // REMOVE: Removed the inner declaration of baseTokenData as it is now global

  test("should successfully create and save a new password reset token", async () => {
    const validToken = new PasswordResetToken(baseTokenData);
    const savedToken = await validToken.save();

    expect(savedToken._id).toBeDefined();
    expect(savedToken.userId).toEqual(testUserId);
    expect(savedToken.token).toBe(baseTokenData.token);
    expect(savedToken.expires.getTime()).toBeCloseTo(
      baseTokenData.expires.getTime(),
      -1
    );
    expect(savedToken.createdAt).toBeDefined();
    expect(savedToken.updatedAt).toBeDefined();
  });

  // --- Required Field Validation Tests ---

  // NOTE: This test passed because we are actively passing undefined for required userId
  test("should fail to save if userId is missing", async () => {
    const data = { ...baseTokenData, userId: undefined };

    const token = new PasswordResetToken(
      data as unknown as IPasswordResetToken
    );

    await expect(token.save()).rejects.toThrow(
      /PasswordResetToken validation failed: userId: Path `userId` is required/
    );
  });

  // NOTE: These tests should now pass without the brittle errors, as userId is valid.
  test("should fail to save if token field is missing", async () => {
    const data = { ...baseTokenData, token: undefined };

    const token = new PasswordResetToken(
      data as unknown as IPasswordResetToken
    );

    await expect(token.save()).rejects.toThrow(
      /PasswordResetToken validation failed: token: Path `token` is required/
    );
  });

  test("should fail to save if expires field is missing", async () => {
    const data = { ...baseTokenData, expires: undefined };

    const token = new PasswordResetToken(
      data as unknown as IPasswordResetToken
    );

    await expect(token.save()).rejects.toThrow(
      /PasswordResetToken validation failed: expires: Path `expires` is required/
    );
  });

  // --- Unique Index Tests ---

  test("should fail to save if token is duplicated", async () => {
    const duplicateTokenValue = "shared-unique-reset-token";

    // 1. Save the first token successfully
    await PasswordResetToken.create({
      ...baseTokenData,
      token: duplicateTokenValue,
      userId: testUserId,
    });

    // 2. Attempt to save a second token with the same token value
    // Create a new user for the second token
    const anotherMockUser = await MockUser.create({
      email: "another_user@test.com",
    });
    const secondToken = new PasswordResetToken({
      userId: anotherMockUser._id, // Different user
      token: duplicateTokenValue, // Same token
      expires: baseTokenData.expires,
    });

    await expect(secondToken.save()).rejects.toThrow();

    try {
      await secondToken.save();
    } catch (error) {
      const mongoErr = error as mongoose.mongo.MongoServerError;
      expect(mongoErr.code).toBe(11000);
    }
  });

  test("should succeed if tokens are different, even for the same user", async () => {
    // 1. Save first token
    await PasswordResetToken.create({ ...baseTokenData, token: "first-token" });

    // 2. Save second token for the same user
    const secondToken = new PasswordResetToken({
      ...baseTokenData,
      token: "second-token",
    });

    await expect(secondToken.save()).resolves.toBeDefined();
  });
});
