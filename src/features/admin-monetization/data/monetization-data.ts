import { AdminMonetizationConfig, AdMobConfig, TeacherCoursePricing } from "../types";

export const INITIAL_MONETIZATION_CONFIG: AdminMonetizationConfig = {
  subPrice: 9.99,
  trialDays: 7,
  freeLives: 5,
  courseMin: 4.99,
  courseMax: 99.99,
  teacherSplit: 70,
  platformSplit: 30,
  gateways: {
    stripe: {
      subPriceId: "price_1PqX99WordtapMonthly",
      trialHoldId: "seti_1PqX88WordtapTrialHold",
    },
    apple: {
      productId: "com.wordtap.subscription.monthly.tier1",
      tier: "10",
    },
    google: {
      productId: "wordtap_sub_monthly",
      basePlanId: "monthly-auto-renewing",
    },
  },
};

export const INITIAL_ADMOB_CONFIG: AdMobConfig = {
  interstitialFreq: 3,
  bannersEnabled: true,
  rewardedEnabled: true,
};

export const INITIAL_TEACHER_COURSES: TeacherCoursePricing[] = [
  {
    id: "c-2",
    title: "Curso Premium WordTap",
    level: "B1 Intermediate",
    model: "Venta Directa + Sub",
    sales: 42,
    price: 19.99,
  },
  {
    id: "c-3",
    title: "B1 Conversational Travel",
    level: "B1 Intermediate",
    model: "Venta Directa (Borrador)",
    sales: 0,
    price: 24.99,
  },
  {
    id: "c-1",
    title: "Inglés Básico Gratuito",
    level: "A1 Beginner",
    model: "Acceso Libre (Gratuito)",
    sales: 0,
    price: 0.0,
  },
];
