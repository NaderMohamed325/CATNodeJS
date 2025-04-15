import mongoose from 'mongoose';

interface ICategory extends mongoose.Document {
  name: string;
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

export { Category, ICategory };
