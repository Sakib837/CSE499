import mongoose from 'mongoose';
import { FUEL_TYPES } from '../config/constants.js';

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Station name is required'],
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        default: '',
      },
      coordinates: {
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
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    totalCapacity: {
      type: Number,
      required: true,
      default: 10000, // liters
    },
    currentFuelLevel: {
      type: Number,
      default: 0,
    },
    fuelTypes: [
      {
        type: String,
        enum: Object.values(FUEL_TYPES),
      },
    ],
    machineIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Machine',
      },
    ],
    operatingHours: {
      open: {
        type: String,
        default: '06:00',
      },
      close: {
        type: String,
        default: '22:00',
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active',
    },
    dailySalesTarget: {
      type: Number,
      default: 5000, // liters
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

stationSchema.index({ 'location.coordinates': '2dsphere' });
stationSchema.index({ managerId: 1 });
stationSchema.index({ status: 1 });

const Station = mongoose.model('Station', stationSchema);
export default Station;
