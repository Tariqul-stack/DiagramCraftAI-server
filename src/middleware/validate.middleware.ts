import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: messages,
        });
        return;
      }

      next(err);
    }
  };

export default validate;
