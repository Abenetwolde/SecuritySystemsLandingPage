import { z } from 'zod'

// ── Base schema shared by all product requests ──
export const baseRequestSchema = z.object({
  companyName:   z.string().min(3, 'Min 3 characters').max(100, 'Max 100 characters'),
  contactPerson: z.string().min(2, 'Min 2 characters').max(50, 'Max 50 characters'),
  contactEmail:  z.string().email('Invalid email address'),
  contactPhone:  z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, 'Phone must be 10–15 digits, optional leading +'),
})

// ── Gasha AV / WAF / VPN / Nisir / IAM / Code Protection ──
export const avRequestSchema = baseRequestSchema.extend({
  totalComputers:         z.coerce.number().int().positive('Must be a positive integer'),
  windowOperatingSystems: z.coerce.number().int().min(0, 'Cannot be negative'),
  linuxOperatingSystems:  z.coerce.number().int().min(0, 'Cannot be negative'),
  Bit32:                  z.coerce.number().int().min(0, 'Cannot be negative'),
  Bit64:                  z.coerce.number().int().min(0, 'Cannot be negative'),
  website:                z.string().url('Invalid URL').optional().or(z.literal('')),
  officeNo:               z.string().optional(),
  jobTitle:               z.string().optional(),
  department:             z.string().optional(),
})

// ── ABIS Biometrics ──
export const abisRequestSchema = baseRequestSchema.extend({
  typeOfService:           z.string().min(1, 'Required'),
  purposeOfRequest:        z.string().min(1, 'Required'),
  numberOfUsers:           z.coerce.number().int().positive('Must be a positive integer'),
  integrationRequirements: z.string().min(1, 'Required'),
  biometricModality:       z.enum([
    'Fingerprint',
    'Face',
    'Iris',
    'Face and Fingerprint',
    'Face and Iris',
    'Fingerprint and Iris',
    'Face, Fingerprint and Iris',
  ]),
  serviceDuration:  z.string().min(1, 'Required'),
  additionalNotes:  z.string().optional(),
})

// ── Feedback ──
export const feedbackSchema = z.object({
  feedback: z.string().min(10, 'Please write at least 10 characters').max(2000, 'Max 2000 characters'),
})

// ── Inferred types ──
export type AVRequestData   = z.infer<typeof avRequestSchema>
export type ABISRequestData = z.infer<typeof abisRequestSchema>
export type FeedbackData    = z.infer<typeof feedbackSchema>

// ── Server action result ──
export type ActionResult =
  | { success: true; message: string }
  | { success: false; error: string }
