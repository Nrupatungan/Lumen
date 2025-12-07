import {
  describe,
  beforeAll,
  afterAll,
  expect,
  test,
  beforeEach,
} from "vitest";
import { clearDatabase, setupTestDB, teardownTestDB } from "../../setup.js";
import mongoose from "mongoose";
import { IVerificationToken, VerificationToken } from "@repo/db";

// ----------------------------------------------------
// Database Hooks
// ----------------------------------------------------

beforeAll(async () => {
  await setupTestDB();
});

beforeEach(async () => {
  // Clear the VerificationToken collection before each test
  await clearDatabase();
});

afterAll(async () => {
  await teardownTestDB();
});

// ----------------------------------------------------
// VerificationToken Model Tests
// ----------------------------------------------------

describe("VerificationToken Model Validation and Indexing", () => {
  const baseTokenData = {
    identifier: "user@example.com",
    token: "random-secure-token-12345",
    expires: new Date(Date.now() + 3600000), // 1 hour from now
  };

  test("should successfully create and save a new token", async () => {
    const validToken = new VerificationToken(baseTokenData);
    const savedToken = await validToken.save();

    expect(savedToken._id).toBeDefined();
    expect(savedToken.identifier).toBe(baseTokenData.identifier);
    expect(savedToken.token).toBe(baseTokenData.token);
    // Check if the saved date is close to the original date (allowing for minor save-time drift)
    expect(savedToken.expires.getTime()).toBeCloseTo(
      baseTokenData.expires.getTime(),
      -1
    );
    expect(savedToken.createdAt).toBeDefined();
    expect(savedToken.updatedAt).toBeDefined();
  });

  test("should successfully create and save a token without an identifier", async () => {
    const minimalData = {
      token: "minimal-token-54321",
      expires: new Date(Date.now() + 3600000),
    };
    const minimalToken = new VerificationToken(minimalData);
    const savedToken = await minimalToken.save();

    expect(savedToken._id).toBeDefined();
    expect(savedToken.identifier).toBeUndefined();
    expect(savedToken.token).toBe(minimalData.token);
  });

  // --- Required Field Validation Tests ---

  test("should fail to save if token field is missing", async () => {
    const data = { ...baseTokenData, token: undefined };

    const token = new VerificationToken(data as unknown as IVerificationToken);

    await expect(token.save()).rejects.toThrow(
      /VerificationToken validation failed: token: Path `token` is required/
    );
  });

  test("should fail to save if expires field is missing", async () => {
    const data = { ...baseTokenData, expires: undefined };

    const token = new VerificationToken(data as unknown as IVerificationToken);

    await expect(token.save()).rejects.toThrow(
      /VerificationToken validation failed: expires: Path `expires` is required/
    );
  });

  // --- Unique Index Tests (token only) ---

  test("should fail to save if token is duplicated (single index check)", async () => {
    const duplicateTokenValue = "shared-unique-token";

    // 1. Save the first token successfully
    await VerificationToken.create({
      ...baseTokenData,
      token: duplicateTokenValue,
      identifier: "user1@test.com",
    });

    // 2. Attempt to save a second token with the same token value
    const secondToken = new VerificationToken({
      ...baseTokenData,
      token: duplicateTokenValue,
      identifier: "user2@test.com", // Different identifier, but token must be unique
    });

    // Expecting save to reject due to unique index error (code 11000)
    await expect(secondToken.save()).rejects.toThrow();

    try {
      await secondToken.save();
    } catch (error) {
      const mongoErr = error as mongoose.mongo.MongoServerError;
      expect(mongoErr.code).toBe(11000);
    }
  });

  // --- Compound Unique Index Tests ---

  test("should fail to save if identifier AND token are duplicated (compound index check)", async () => {
    const commonIdentifier = "common@user.com";
    const commonToken = "compound-token-1";

    // 1. Save the first token
    await VerificationToken.create({
      identifier: commonIdentifier,
      token: commonToken,
      expires: baseTokenData.expires,
    });

    // 2. Attempt to save the second token with the exact same compound key
    const secondToken = new VerificationToken({
      identifier: commonIdentifier,
      token: commonToken,
      expires: baseTokenData.expires,
    });

    // Expecting save to reject due to compound unique index error
    await expect(secondToken.save()).rejects.toThrow();

    try {
      await secondToken.save();
    } catch (error) {
      const mongoErr = error as mongoose.mongo.MongoServerError;
      expect(mongoErr.code).toBe(11000);
    }
  });

  test("should succeed if identifier is different, even if token is also unique", async () => {
    // This is technically covered by the single index test, but confirms compound index behavior.
    const tokenValue = "unique-in-this-test";

    // Token 1
    await VerificationToken.create({
      identifier: "user1@test.com",
      token: tokenValue,
      expires: baseTokenData.expires,
    });

    // Token 2: New identifier, unique token (should save successfully)
    const token2 = new VerificationToken({
      identifier: "user2@test.com",
      token: "another-token",
      expires: baseTokenData.expires,
    });

    await expect(token2.save()).resolves.toBeDefined();
  });
});
