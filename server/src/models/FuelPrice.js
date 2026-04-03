import mongoose from 'mongoose';
import { FUEL_TYPES } from '../config/constants.js';

const fuelPriceSchema = new mongoose.Schema(
  {
    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: [true, 'Station ID is required'],
    },
    machineId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Machine',
      required: [true, 'Machine ID is required'],
    },
    fuelType: {
      type: String,
      enum: Object.values(FUEL_TYPES),
      required: true,
    },
    pricePerLiter: {
      type: Number,
      required: [true, 'Price is required'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    previousPrice: {
      type: Number,
      default: 0,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    effectiveDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
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

fuelPriceSchema.index({ stationId: 1 });
fuelPriceSchema.index({ machineId: 1 });
fuelPriceSchema.index({ fuelType: 1 });
fuelPriceSchema.index({ changedAt: -1 });

const FuelPrice = mongoose.model('FuelPrice', fuelPriceSchema);
export default FuelPrice;
