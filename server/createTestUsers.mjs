import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const MONGODB_URI = "mongodb+srv://nazmulsakib01_db_user:Wo5NKsWLNxJ1cIcw@clustercse499.ts5lxtm.mongodb.net/?appName=ClusterCSE499";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  hashedPassword: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "employee"], default: "user" },
  status: { type: String, enum: ["active", "pending"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

async function createTestUsers() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: "fuel_dispensing" });
    console.log("✓ Connected to MongoDB");

    const testUsers = [
      { email: "user@example.com", password: "password123", role: "user" },
      { email: "admin@example.com", password: "admin@123456", role: "admin" },
      { email: "emp@example.com", password: "password123", role: "employee" },
    ];

    for (const testUser of testUsers) {
      const existingUser = await User.findOne({ email: testUser.email });
      if (existingUser) {
        console.log(`- Already exists: ${testUser.email}`);
        continue;
      }

      const hashedPassword = await bcryptjs.hash(testUser.password, 10);
      const newUser = new User({
        email: testUser.email,
        hashedPassword,
        role: testUser.role,
        status: "active",
      });

      await newUser.save();
      console.log(`✓ Created: ${testUser.email} (${testUser.role})`);
    }

    console.log("✓ All test users ready!");
    await mongoose.disconnect();
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  }
}

createTestUsers();
