import mongoose from 'mongoose';

const fuelInventorySchema = new mongoose.Schema(
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
    currentLevel: {
      type: Number,
      required: true,
      default: 0,
    },
    capacity: {
      type: Number,
      required: true,
    },
    percentageFull: {
      type: Number,
      default: 0,
    },
    lowLevelThreshold: {
      type: Number,
      default: 500, // liters
    },
    criticalThreshold: {
      type: Number,
      default: 100, // liters
    },
    lastRestockDate: {
      type: Date,
      default: null,
    },
    nextShipmentETA: {
      type: Date,
      default: null,
    },
    shipmentStatus: {
      type: String,
      enum: ['pending', 'in_transit', 'delivered'],
      default: 'pending',
    },
    restockHistory: [
      {
        date: Date,
        quantityAdded: Number,
        previousLevel: Number,
        newLevel: Number,
        restockedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
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

fuelInventorySchema.index({ stationId: 1 });
fuelInventorySchema.index({ machineId: 1 });
fuelInventorySchema.index({ currentLevel: 1 });

const FuelInventory = mongoose.model('FuelInventory', fuelInventorySchema);
export default FuelInventory;
