export const PLAN_LIMITS = {
  free: {
    generationsPerMonth: 3,
    imagesPerGeneration: 2,
  },
  premium: {
    generationsPerMonth: 90,
    imagesPerGeneration: Infinity,
  },
} as const

export type Plan = keyof typeof PLAN_LIMITS

export interface UserPlan {
  plan: Plan
  generationsUsed: number
  imagesUsed: number
  periodStart: string
}

export function canGenerate(userPlan: UserPlan): boolean {
  const limit = PLAN_LIMITS[userPlan.plan].generationsPerMonth
  return userPlan.generationsUsed < limit
}

export function canGenerateImage(userPlan: UserPlan, imagesThisGeneration: number): boolean {
  const limit = PLAN_LIMITS[userPlan.plan].imagesPerGeneration
  if (limit === Infinity) return true
  return imagesThisGeneration < limit
}

export function getRemainingGenerations(userPlan: UserPlan): number {
  const limit = PLAN_LIMITS[userPlan.plan].generationsPerMonth
  return Math.max(0, limit - userPlan.generationsUsed)
}
