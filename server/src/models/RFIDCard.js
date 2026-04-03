import mongoose from 'mongoose';
import { RFID_STATUS } from '../config/constants.js';

const rfidCardSchema = new mongoose.Schema(
  {
    cardId: {
      type: String,
      required: [true, 'Card ID is required'],
      unique: true,
      uppercase: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    status: {
      type: String,
      enum: Object.values(RFID_STATUS),
      default: RFID_STATUS.ACTIVE,
    },
    assignedDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for card lookup and user lookup
rfidCardSchema.index({ cardId: 1 });
rfidCardSchema.index({ userId: 1 });
rfidCardSchema.index({ status: 1 });
rfidCardSchema.index({ expiryDate: 1 });

const RFIDCard = mongoose.model('RFIDCard', rfidCardSchema);
export default RFIDCard;
