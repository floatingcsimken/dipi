import { z } from 'zod';

export const AttackProgressionSchema = z.object({
  origin: z.array(z.object({
    name: z.string(),
    techniqueId: z.string().optional(),
    description: z.string(),
  })).default([]),
  currentTechniques: z.array(z.string()).default([]),
  predictedNext: z.array(z.object({
    name: z.string(),
    techniqueId: z.string().optional(),
    description: z.string(),
  })).default([]),
  threatProfile: z.object({
    patternName: z.string(),
    reasoning: z.string(),
  }).optional(),
  analystSummary: z.string().default(''),
});