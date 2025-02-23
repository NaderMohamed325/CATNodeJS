import { ZodError, ZodSchema } from "zod";

const SchemaValidation = function <T>(Schema: ZodSchema<T>, data: any) {
  try {
    const validationResult = Schema.parse(data);
    return {data:validationResult};
  } catch (err) {
    if (err instanceof ZodError) {
      const errorDetails = err.errors.map((error) => ({
        field: error.path.join('.'),
        message: error.message,
      }));
      return { errors: errorDetails };
    } else {
      return { errors: "Unknown error occurred during validation" };
    }
  }
};

export { SchemaValidation };