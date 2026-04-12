import { z } from 'zod';

export const createAddressSchema = z.object({
  label: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  district: z.string().min(1),
  province: z.string().min(1),
  isDefault: z.boolean().optional(),
});

