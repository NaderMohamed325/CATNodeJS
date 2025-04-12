import mongoose, { Document, Model, Types } from 'mongoose';

// Interface for Cart Item
interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

// Interface for Cart Document
interface ICart extends Document {
  user: Types.ObjectId;
  items: ICartItem[];
  cart_price: number;
  createdAt: Date;
  updatedAt: Date;
}

// Cart Item Schema
const cartItemSchema = new mongoose.Schema<ICartItem>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { _id: false }
);

// Cart Schema
const cartSchema = new mongoose.Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    items: [cartItemSchema],
    cart_price: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total price before saving
cartSchema.pre<ICart>('save', async function (next) {
  try {
    // Calculate total by summing (price * quantity) of all items
    this.cart_price = this.items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
    next();
  } catch (error: any) {
    next(error);
  }
});

// Cart Model
const Cart: Model<ICart> = mongoose.model<ICart>('Cart', cartSchema);

export { Cart, ICart, ICartItem };