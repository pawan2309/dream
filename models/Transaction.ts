import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'BET_PLACED' | 'BET_WON' | 'BET_LOST' | 'COMMISSION' | 'BONUS' | 'REFUND' | 'TRANSFER';
  amount: number;
  balance: number; // Balance after transaction
  description?: string;
  reference?: string; // External reference
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  userId: mongoose.Types.ObjectId;
  createdById?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  type: {
    type: String,
    enum: ['DEPOSIT', 'WITHDRAWAL', 'BET_PLACED', 'BET_WON', 'BET_LOST', 'COMMISSION', 'BONUS', 'REFUND', 'TRANSFER'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  balance: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  reference: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdById: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
transactionSchema.index({ userId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: 1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, status: 1 });

// Virtual for user
transactionSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Virtual for created by user
transactionSchema.virtual('createdBy', {
  ref: 'User',
  localField: 'createdById',
  foreignField: '_id',
  justOne: true
});

// Ensure virtuals are serialized
transactionSchema.set('toJSON', { virtuals: true });
transactionSchema.set('toObject', { virtuals: true });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema); 