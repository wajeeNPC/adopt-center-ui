import { z } from 'zod';

// Pet form validation schema
export const petSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  species: z.enum(['Dog', 'Cat'], {
    errorMap: () => ({ message: 'Please select a species' })
  }),
  
  breed: z.string()
    .min(1, 'Breed is required'),
  
  age: z.string()
    .min(1, 'Age is required')
    .regex(/^\d+$/, 'Age must be a number'),
  
  gender: z.enum(['Male', 'Female'], {
    errorMap: () => ({ message: 'Please select a gender' })
  }),
  
  size: z.enum(['Small', 'Medium', 'Large'], {
    errorMap: () => ({ message: 'Please select a size' })
  }),
  
  weight: z.string()
    .optional()
    .refine((val) => !val || val === '' || /^\d+(\.\d+)?$/.test(val), {
      message: 'Weight must be a valid number'
    }),
  
  color: z.string()
    .min(1, 'Color is required'),
  
  adoptionFee: z.string()
    .regex(/^\d+(\.\d+)?$/, 'Adoption fee must be a valid number'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  
  specialNeeds: z.string().optional(),
  
  energyLevel: z.enum(['Low', 'Moderate', 'High', 'Very High'], {
    errorMap: () => ({ message: 'Please select energy level' })
  }),
  
  adoptionStatus: z.enum(['Available', 'Pending', 'Adopted'], {
    errorMap: () => ({ message: 'Please select adoption status' })
  }).optional(),
  
  // Boolean fields
  goodWithKids: z.boolean(),
  goodWithPets: z.boolean(),
  vaccinated: z.boolean(),
  neutered: z.boolean(),
  houseTrained: z.boolean(),
});

// Helper function to validate and get errors
export const validatePetForm = (data) => {
  try {
    petSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError && error.issues && Array.isArray(error.issues)) {
      const errors = {};
      error.issues.forEach((err) => {
        if (err.path && err.path[0]) {
          errors[err.path[0]] = err.message;
        }
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};
