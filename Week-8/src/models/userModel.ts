import mongoose from 'mongoose';
import { z } from 'zod';
import bcrypt from 'bcrypt';

enum role {
  'user',
  admin,
}

interface IUser extends mongoose.Document {
  username: string;
  email: string;
  role: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, 
      enum: Object.values(role), 
      default: 'user' }, 
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], async function (next) {
  const update = this.getUpdate() as Partial<IUser>;

  if (update.password) {
    const salt = await bcrypt.genSalt(12);
    update.password = await bcrypt.hash(update.password, salt);
    this.setUpdate(update);
  }

  next();
});

const User = mongoose.model<IUser>('User', userSchema);

const userZodSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']).default('user'), 
});

export { User, userZodSchema };
