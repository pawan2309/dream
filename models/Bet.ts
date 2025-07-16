import mongoose, { Document, Schema } from 'mongoose';

export interface IBet extends Document {
  amount: number;
  odds: number;
  potentialWin: number;
  status: 'PENDING' | 'WON' | 'LOST' | 'CANCELLED' | 'REFUNDED';
  result?: 'WIN' | 'LOSS' | 'DRAW' | 'CANCELLED';
  gameId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const betSchema = new Schema<IBet>({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  odds: {
    type: Number,
    required: true,
    min: 1.0
  },
  potentialWin: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['PENDING', 'WON', 'LOST', 'CANCELLED', 'REFUNDED'],
    default: 'PENDING'
  },
  result: {
    type: String,
    enum: ['WIN', 'LOSS', 'DRAW', 'CANCELLED']
  },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
betSchema.index({ userId: 1 });
betSchema.index({ gameId: 1 });
betSchema.index({ status: 1 });
betSchema.index({ createdAt: 1 });
betSchema.index({ userId: 1, status: 1 });

// Virtual for game
betSchema.virtual('game', {
  ref: 'Game',
  localField: 'gameId',
  foreignField: '_id',
  justOne: true
});

// Virtual for user
betSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Ensure virtuals are serialized
betSchema.set('toJSON', { virtuals: true });
betSchema.set('toObject', { virtuals: true });

export default mongoose.models.Bet || mongoose.model<IBet>('Bet', betSchema); 