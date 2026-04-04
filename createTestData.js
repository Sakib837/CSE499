import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './server/src/models/User.js';
import Transaction from './server/src/models/Transaction.js';
import UserBalance from './server/src/models/UserBalance.js';

dotenv.config({ path: './server/.env' });

try {
  const dbUri = process.env.DB_URI;
  if (!dbUri) {
    throw new Error('DB_URI environment variable is not set. Please check your .env file.');
  }
  await mongoose.connect(dbUri);
  console.log('Connected to MongoDB');

  // Create test user
  let testUser = await User.findOne({ email: 'user@example.com' });
  if (!testUser) {
    testUser = new User({
      email: 'user@example.com',
      passwordHash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/LLG',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      status: 'active'
    });
    await testUser.save();
    console.log('Created test user:', testUser._id);
  } else {
    console.log('Test user already exists:', testUser._id);
  }

  // Create balance for test user
  let balance = await UserBalance.findOne({ userId: testUser._id });
  if (!balance) {
    balance = new UserBalance({
      userId: testUser._id,
      balance: 500,
      currency: 'USD'
    });
    await balance.save();
    console.log('Created balance record');
  }

  // Create sample transactions
  const existingTxns = await Transaction.countDocuments({ userId: testUser._id });
  if (existingTxns === 0) {
    const now = new Date();
    for(let i = 0; i < 20; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - Math.floor(Math.random() * 7));
      
      const transaction = new Transaction({
        userId: testUser._id,
        machineId: new mongoose.Types.ObjectId(),
        transactionType: 'refuel',
        requestedAmount: Math.random() * 50 + 10,
        actualAmount: Math.random() * 45 + 10,
        cost: Math.random() * 150 + 50,
        fuelType: 'Petrol',
        status: 'completed',
        createdAt: date
      });
      await transaction.save();
    }
    console.log('Created 20 sample transactions');
  } else {
    console.log(`${existingTxns} transactions already exist`);
  }

  await mongoose.connection.close();
  console.log('Done');
  process.exit(0);
} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}
