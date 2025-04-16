// controllers/adminCategoryController.ts
import { Request, Response, NextFunction } from "express";
import { Category } from "../models/categoryModel";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/appError";
import { apiFeatures } from "../utils/apiFeatures";

// Create Category
const adminCreateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    if (!name) return next(new AppError("Category name is required", 400));

    const exists = await Category.findOne({ name });
    if (exists) return next(new AppError("Category already exists", 400));

    const category = await Category.create({ name });

    res.status(201).json({
      status: "success",
      data: { category },
    });
  }
);

// Get All Categories
const getAllCategories = catchAsync(async (req, res) => {
  const features = new apiFeatures(Category.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const categories = await features.query;
  res.status(200).json({
    status: "success",
    length: categories.length,
    data: { categories },
  });
});

// Delete Category
const adminDeleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) return next(new AppError("Category not found", 404));

  res.status(200).json({
    status: "success",
    message: "Category deleted",
  });
});

export { adminCreateCategory, getAllCategories, adminDeleteCategory };
