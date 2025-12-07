import "dotenv/config";
import { connectDB } from "@repo/db";
import { AuthService } from "../modules/auth/auth.service";

async function run() {
  connectDB(String(process.env.MONGO_URI), String(process.env.MONGO_DB_NAME));

  const email = String(process.env.SEED_ADMIN_EMAIL);
  const password = String(process.env.SEED_ADMIN_PASSWORD);
  const name = String(process.env.SEED_ADMIN_NAME);
  const image = String(process.env.SEED_ADMIN_IMAGE);

  const existing = await AuthService.findUserByEmail(email);
  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const admin = await AuthService.createUser({
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
