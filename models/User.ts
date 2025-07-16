import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  code?: string;
  contactno?: string;
  password: string;
  role: 'BOSS' | 'SUB_USER' | 'MASTER' | 'SUPER' | 'AGENT' | 'CLIENT';
  name?: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED';
  parentId?: mongoose.Types.ObjectId;
  createdById?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateUsername(): Promise<string>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  contactno: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['BOSS', 'SUB_USER', 'MASTER', 'SUPER', 'AGENT', 'CLIENT'],
    default: 'CLIENT'
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'BANNED'],
    default: 'ACTIVE'
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdById: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ parentId: 1 });
userSchema.index({ createdById: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate username method
userSchema.methods.generateUsername = async function(): Promise<string> {
  const prefix = this.role.substring(0, 2).toUpperCase();
  let counter = 1;
  let username = `${prefix}${counter.toString().padStart(3, '0')}`;
  
  while (await mongoose.model('User').findOne({ username })) {
    counter++;
    username = `${prefix}${counter.toString().padStart(3, '0')}`;
  }
  
  return username;
};

// Virtual for user hierarchy
userSchema.virtual('parent', {
  ref: 'User',
  localField: 'parentId',
  foreignField: '_id',
  justOne: true
});

userSchema.virtual('children', {
  ref: 'User',
  localField: '_id',
  foreignField: 'parentId'
});

userSchema.virtual('createdBy', {
  ref: 'User',
  localField: 'createdById',
  foreignField: '_id',
  justOne: true
});

userSchema.virtual('createdUsers', {
  ref: 'User',
  localField: '_id',
  foreignField: 'createdById'
});

// Ensure virtuals are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema); 