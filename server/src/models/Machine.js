import mongoose from 'mongoose';
import { MACHINE_STATUS, FUEL_TYPES, SYSTEM_HEALTH } from '../config/constants.js';

const machineSchema = new mongoose.Schema(
  {
    machineId: {
      type: String,
      required: [true, 'Machine ID is required'],
      unique: true,
      uppercase: true,
    },
    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      required: [true, 'Station ID is required'],
    },
    location: {
      address: {
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
          type: [Number], // [longitude, latitude]
          default: [0, 0],
        },
      },
    },
    model: {
      type: String,
      default: 'RPi5_v1',
    },
    serialNumber: {
      type: String,
      unique: true,
    },
    fuelType: {
      type: String,
      enum: Object.values(FUEL_TYPES),
      required: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      default: 1000, // liters
    },
    status: {
      type: String,
      enum: Object.values(MACHINE_STATUS),
      default: MACHINE_STATUS.OFFLINE,
    },
    lastHeartbeat: {
      type: Date,
      default: null,
    },
    systemHealth: {
      type: String,
      enum: Object.values(SYSTEM_HEALTH),
      default: SYSTEM_HEALTH.NORMAL,
    },
    totalTransactions: {
      type: Number,
      default: 0,
    },
    totalLitersSold: {
      type: Number,
      default: 0,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    macAddress: {
      type: String,
      default: '',
    },
    apiKey: {
      type: String,
      default: null,
      select: false,
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

// Geospatial index for location queries
machineSchema.index({ 'location.coordinates': '2dsphere' });
machineSchema.index({ machineId: 1 });
machineSchema.index({ stationId: 1 });
machineSchema.index({ status: 1 });
machineSchema.index({ lastHeartbeat: 1 });

const Machine = mongoose.model('Machine', machineSchema);
export default Machine;
