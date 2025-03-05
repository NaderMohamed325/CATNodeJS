import express, { Request, Response } from 'express';
import mongoose, { SortOrder } from 'mongoose';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/Week7')
  .then(() => console.log('✅ DB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Define Mongoose Schema
const toursSchema = new mongoose.Schema({
  departure: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  passengers: { type: Number, required: true },
});
const Tours = mongoose.model('tours', toursSchema);

// Helper function to convert string date to Date object
const dateConvert = (MYdate: string): Date => {
  const [year, month, day] = MYdate.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// GET: Fetch trips with filtering, sorting, and pagination
app.get('/api/trips', async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', date_from, date_till, departure, destination, sort } = req.query as {
      page?: string;
      limit?: string;
      date_from?: string;
      date_till?: string;
      departure?: string;
      destination?: string;
      sort?: string;
    };

    // Pagination setup
    const pageInt = Math.max(parseInt(page, 10) || 1, 1);
    const limitInt = Math.max(parseInt(limit, 10) || 10, 1);
    const skipInt = (pageInt - 1) * limitInt;

    // Filtering logic
    const filters: any = {};
    if (date_from) filters.startDate = { $gte: dateConvert(date_from) };
    if (date_till) {
      const tillDate = dateConvert(date_till);
      filters.$or = [
        { endDate: { $lte: tillDate } }, // Trips with an `endDate`
        { endDate: { $exists: false }, startDate: { $lte: tillDate } }, // Trips without `endDate`
      ];
    }
    if (departure) filters.departure = departure;
    if (destination) filters.destination = destination;

    // Sorting logic
    let sortOrder: { [key: string]: SortOrder } = {};
    if (sort) {
      const sortFields = sort.split(',');
      sortFields.forEach((field) => {
        if (field.startsWith('-')) {
          sortOrder[field.slice(1)] = 'desc';
        } else {
          sortOrder[field] = 'asc';
        }
      });
    } else {
      sortOrder = { startDate: 'asc' }; // Default sorting
    }

    // Fetch data with filters, pagination, and sorting
    const trips = await Tours.find(filters).skip(skipInt).limit(limitInt).sort(sortOrder);

    // Response
    res.json({
      status: 'success',
      page: pageInt,
      limit: limitInt,
      results: trips.length,
      data: trips,
    });
  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
  }
});

// Start Server
app.listen(3000, () => console.log('🚀 Server running on port 3000'));
