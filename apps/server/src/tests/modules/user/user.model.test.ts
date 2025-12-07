import {
  describe,
  beforeAll,
  afterAll,
  expect,
  test,
  beforeEach,
} from "vitest";
import { setupTestDB, clearDatabase, teardownTestDB } from "../../setup.js";
import mongoose from "mongoose";
import { User } from "@repo/db";

// Mock the environment variable for bcrypt salt rounds
process.env.SALT_ROUNDS = "4";

// ----------------------------------------------------
// Database Hooks
// ----------------------------------------------------

beforeAll(async () => {
  await setupTestDB();
});

beforeEach(async () => {
  // Clear the database before each test
  await clearDatabase();
});

afterAll(async () => {
  await teardownTestDB();
});

// ----------------------------------------------------
// User Model Tests
// ----------------------------------------------------

describe("User Model Persistence and Security", () => {
  const baseUserData = {
    name: "Test User",
    email: "test.user@example.com",
    password: "SecurePassword123",
  };

  test("should successfully create a minimal user with default role", async () => {
    const minimalUser = new User({ email: "minimal@test.com" });
    const savedUser = await minimalUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe("minimal@test.com");
    expect(savedUser.role).toBe("user"); // Check default value
    expect(savedUser.name).toBeUndefined(); // Check optional field

    // Check timestamps
    expect(savedUser.createdAt).toBeDefined();
    expect(savedUser.updatedAt).toBeDefined();
  });

  test("should successfully create an admin user", async () => {
    const adminUser = new User({ email: "admin@test.com", role: "admin" });
    const savedUser = await adminUser.save();

    expect(savedUser.role).toBe("admin");
  });

  // --- Email Uniqueness Test ---

  test("should fail to save if email is duplicated", async () => {
    const commonEmail = "duplicate@test.com";

    // 1. Save the first user successfully
    await User.create({ name: "User One", email: commonEmail });

    // 2. Attempt to save the second user with the same email
    const secondUser = new User({ name: "User Two", email: commonEmail });

    await expect(secondUser.save()).rejects.toThrow();

    try {
      await secondUser.save();
    } catch (error) {
      const mongoErr = error as mongoose.mongo.MongoServerError;
      expect(mongoErr.code).toBe(11000);
    }
  });

  // --- Password Hashing and Comparison Tests ---

  test("should hash the password before saving", async () => {
    const userWithPassword = new User(baseUserData);
    const savedUser = await userWithPassword.save();

    // Retrieve the user, including the password field which is normally deselected
    // NOTE: In the test environment, Mongoose might not automatically handle the 'select: false' option
    // unless explicitly queried, but we must verify the hash was generated.
    const userWithHashedPass = await User.findById(savedUser._id).select(
      "+password"
    );

    expect(userWithHashedPass?.password).toBeDefined();
    // A bcrypt hash is typically much longer than the original password
    expect(userWithHashedPass?.password?.length).toBeGreaterThan(
      baseUserData.password.length
    );
    // The password should not equal the plain text version
    expect(userWithHashedPass?.password).not.toBe(baseUserData.password);
  });

  test("comparePassword should return true for correct password", async () => {
    const user = new User(baseUserData);
    const savedUser = await user.save();

    // To use comparePassword, we must fetch the user and ensure the password field is present
    const userWithPass = await User.findById(savedUser._id).select("+password");

    // Use the instance method
    const isMatch = await userWithPass?.comparePassword(baseUserData.password);

    expect(isMatch).toBe(true);
  });

  test("comparePassword should return false for incorrect password", async () => {
    const user = new User(baseUserData);
    const savedUser = await user.save();

    const userWithPass = await User.findById(savedUser._id).select("+password");

    const isMatch = await userWithPass?.comparePassword("WrongPassword!");

    expect(isMatch).toBe(false);
  });

  test("should not re-hash the password if other fields are modified", async () => {
    const user = new User(baseUserData);
    const savedUser = await user.save();

    const userToUpdate = await User.findById(savedUser._id).select("+password");
    const initialHash = userToUpdate?.password;

    // Modify a non-password field
    userToUpdate!.name = "Updated Name";
    await userToUpdate?.save();

    // Re-fetch the user and check the hash again
    const updatedUser = await User.findById(savedUser._id).select("+password");

    expect(updatedUser?.password).toBe(initialHash); // Hash should be unchanged
    expect(updatedUser?.name).toBe("Updated Name");
  });
});
