// scripts/seedAdmin.ts
import "dotenv/config";
import { connectDB } from "../lib/db.js";
import { UserService } from "../modules/user/user.service.js";

async function run() {
  connectDB();

  const email = String(process.env.SEED_ADMIN_EMAIL);
  const password = String(process.env.SEED_ADMIN_PASSWORD);
  const name = String(process.env.SEED_ADMIN_NAME);
  const image = String(process.env.SEED_ADMIN_IMAGE);

  const existing = await UserService.findByEmail(email);
  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const admin = await UserService.createUser({
    name,
    email,
    password,
    role: "admin",
    image,
    emailVerified: new Date(),
  });

  console.log("Created admin:", admin.email, "id:", admin._id);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
