import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  name: string;
  description?: string;
  type: 'FOOTBALL' | 'CRICKET' | 'TENNIS' | 'BASKETBALL' | 'HORSE_RACING' | 'CASINO' | 'LOTTERY' | 'OTHER';
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED';
  minBet: number;
  maxBet: number;
  odds: number;
  result?: string;
  startTime: Date;
  endTime?: Date;
  createdById: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const gameSchema = new Schema<IGame>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['FOOTBALL', 'CRICKET', 'TENNIS', 'BASKETBALL', 'HORSE_RACING', 'CASINO', 'LOTTERY', 'OTHER'],
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'COMPLETED', 'CANCELLED'],
    default: 'ACTIVE'
  },
  minBet: {
    type: Number,
    default: 0,
    min: 0
  },
  maxBet: {
    type: Number,
    default: 1000,
    min: 0
  },
  odds: {
    type: Number,
    default: 1.0,
    min: 1.0
  },
  result: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  createdById: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
gameSchema.index({ type: 1 });
gameSchema.index({ status: 1 });
gameSchema.index({ startTime: 1 });
gameSchema.index({ createdById: 1 });
gameSchema.index({ status: 1, startTime: 1 });

// Virtual for created by user
gameSchema.virtual('createdBy', {
  ref: 'User',
  localField: 'createdById',
  foreignField: '_id',
  justOne: true
});

// Virtual for bets count
gameSchema.virtual('betsCount', {
  ref: 'Bet',
  localField: '_id',
  foreignField: 'gameId',
  count: true
});

// Ensure virtuals are serialized
gameSchema.set('toJSON', { virtuals: true });
gameSchema.set('toObject', { virtuals: true });

export default mongoose.models.Game || mongoose.model<IGame>('Game', gameSchema); 