import mongoose from 'mongoose';

const genaiQuerySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    role: {
      type: String,
      enum: ['admin', 'employee', 'user'],
      required: true,
    },
    queryText: {
      type: String,
      required: [true, 'Query text is required'],
    },
    queryType: {
      type: String,
      enum: ['summary', 'stats', 'forecast', 'anomaly', 'custom'],
      default: 'custom',
    },
    presetId: {
      type: String,
      default: null,
    },
    context: {
      dateRange: {
        start: Date,
        end: Date,
      },
      stationId: mongoose.Schema.Types.ObjectId,
      metricType: String,
    },
    response: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      default: 'gemini-pro',
    },
    tokensUsed: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    processingTime: {
      type: Number,
      default: 0, // milliseconds
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

genaiQuerySchema.index({ userId: 1 });
genaiQuerySchema.index({ role: 1 });
genaiQuerySchema.index({ timestamp: -1 });
genaiQuerySchema.index({ presetId: 1 });

const GenAIQuery = mongoose.model('GenAIQuery', genaiQuerySchema);
export default GenAIQuery;
