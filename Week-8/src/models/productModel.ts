import mongoose from 'mongoose';
import { z } from 'zod';
import { Category } from './categoryModel'; // Mongoose model for categories

interface IProduct extends mongoose.Document {
  title: string;
  description: string;
  category: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

// Dynamic Zod Schema Function
// models/productModel.ts
const productZodSchema = async () => {
  const categories = await Category.find().lean();
  const validCategories = categories.map((c) => c.name);
  return z.object({
    title: z.string().min(4).max(20),
    description: z.string().min(4).max(200),
    category: z.enum([...validCategories] as [string, ...string[]], {
      errorMap: () => ({ message: `Invalid category. Valid: ${validCategories.join(', ')}` }),
    }),
    price: z.number().min(0),
  });
};

const productMongooseSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      minlength: 4,
      maxlength: 20,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      minlength: 4,
      maxlength: 200,
      default: function (this: IProduct) {
        return this.title;
      },
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model<IProduct>('Product', productMongooseSchema);

export { Product, productZodSchema };
