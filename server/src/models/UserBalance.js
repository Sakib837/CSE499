import mongoose from 'mongoose';

const userBalanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    lockedBalance: {
      type: Number,
      default: 0,
    },
    balanceLockedUntil: {
      type: Date,
      default: null,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    totalRecharged: {
      type: Number,
      default: 0,
    },
    averageTransactionValue: {
      type: Number,
      default: 0,
    },
    lastTransactionDate: {
      type: Date,
      default: null,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userBalanceSchema.index({ userId: 1 });

const UserBalance = mongoose.model('UserBalance', userBalanceSchema);
export default UserBalance;
