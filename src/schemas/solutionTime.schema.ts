import { z } from 'zod';

// getClobStatus response. Spec: required [solution_now], Timestamp = integer, microseconds.
export const SolutionTimeSchema = z.object({
  solution_now: z.number().int(),
});

export type SolutionTime = z.infer<typeof SolutionTimeSchema>;
