import mongoose from 'mongoose';
import { z } from 'zod';

enum Category {
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion',
  HOME_APPLIANCES = 'Home Appliances',
  BEAUTY = 'Beauty & Personal Care',
  BOOKS = 'Books',
  SPORTS = 'Sports & Outdoor',
  TOYS = 'Toys & Games',
  AUTOMOTIVE = 'Automotive',
  GROCERY = 'Grocery',
  HEALTH = 'Health & Wellness',
}

interface IProduct extends mongoose.Document {
  title: string;
  description: string;
  category: Category;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const productZodSchema = z.object({
  title: z
    .string()
    .min(4, 'Title must be at least 4 characters')
    .max(20, 'Title cannot exceed 20 characters'),
  description: z
    .string()
    .min(4, 'Description must be at least 4 characters')
    .max(200, 'Description cannot exceed 200 characters'),
  category: z.nativeEnum(Category, {
    errorMap: () => ({
      message: `Invalid category provided. Valid categories: ${Object.values(Category).join(', ')}`,
    }),
  }),
  price: z.number().min(0, 'Price must be a positive number'),
});

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
      enum: Object.values(Category),
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

export { Product, Category, productZodSchema };
