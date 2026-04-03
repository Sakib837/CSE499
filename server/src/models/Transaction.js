import mongoose from 'mongoose';
import { TRANSACTION_STATUS, FUEL_TYPES } from '../config/constants.js';

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RFIDCard',
      required: [true, 'Card ID is required'],
    },
    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machine',
      required: [true, 'Machine ID is required'],
    },
    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: [true, 'Station ID is required'],
    },
    requestedAmount: {
      type: Number,
      required: [true, 'Requested amount is required'],
    },
    actualAmount: {
      type: Number,
      default: 0,
    },
    fuelType: {
      type: String,
      enum: Object.values(FUEL_TYPES),
      required: true,
    },
    pricePerLiter: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.PENDING,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number,
      default: 0, // seconds
    },
    location: {
      type: String,
      default: '',
    },
    machineLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    sensorData: {
      flowRate: {
        type: Number,
        default: 0,
      },
      temperature: {
        type: Number,
        default: 0,
      },
      anomalies: [String],
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

// Indexes for frequently queried fields
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ userId: 1 });
transactionSchema.index({ machineId: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ 'machineLocation.coordinates': '2dsphere' });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
