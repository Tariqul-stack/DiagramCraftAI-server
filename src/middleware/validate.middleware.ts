import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        const messages = (err as any).errors.map((e: any) => ({
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
