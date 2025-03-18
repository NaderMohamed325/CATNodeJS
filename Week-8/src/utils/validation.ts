import { z } from 'zod';
import { Response } from 'express';

const zodSchemaValidate = (data: any, schema: z.ZodSchema, res: Response) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors.map((err) => err.message) });
  }
  return result.data;
};

export { zodSchemaValidate };
