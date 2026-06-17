import { z } from 'zod';

export const categorySchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  nameFr: z.string().min(1, 'French name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  image: z.string().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
});

export const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactPerson: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const promoCodeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  type: z.enum(['PERCENTAGE', 'FIXED']).optional().default('PERCENTAGE'),
  value: z.number().positive('Value must be positive'),
  minOrderAmount: z.number().min(0).optional().default(0),
  maxUses: z.number().int().positive().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
});

export const bannerSchema = z.object({
  titleFr: z.string().optional().nullable(),
  titleAr: z.string().optional().nullable(),
  subtitleFr: z.string().optional().nullable(),
  subtitleAr: z.string().optional().nullable(),
  imageUrl: z.string().min(1, 'Image URL is required'),
  linkUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const collectionSchema = z.object({
  nameFr: z.string().min(1, 'French name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  slug: z.string().min(1, 'Slug is required'),
  image: z.string().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export const adminSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['SUPER_ADMIN', 'STAFF']).optional().default('STAFF'),
});

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

export const productSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  nameFr: z.string().min(1, 'French name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  descriptionFr: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  categoryId: z.string().min(1, 'Category is required'),
  supplierId: z.string().optional().nullable(),
  costPrice: z.number().min(0).optional().nullable(),
  sellPrice: z.number().min(0, 'Price must be positive'),
  images: z.array(z.string()).optional().default([]),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional().default('DRAFT'),
  featured: z.boolean().optional().default(false),
  variants: z.array(z.object({
    size: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
    colorHex: z.string().optional().nullable(),
    stock: z.number().int().min(0).default(0),
    sku: z.string().optional().default(''),
  })).optional().default([]),
});
