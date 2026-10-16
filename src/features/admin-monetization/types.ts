export interface GatewayConfig {
  stripe: {
    subPriceId: string;
    trialHoldId: string;
  };
  apple: {
    productId: string;
    tier: string;
  };
  google: {
    productId: string;
    basePlanId: string;
  };
}

export interface AdminMonetizationConfig {
  subPrice: number;
  trialDays: number;
  freeLives: number;
  courseMin: number;
  courseMax: number;
  teacherSplit: number;
  platformSplit: number;
  gateways: GatewayConfig;
}

export interface AdMobConfig {
  interstitialFreq: number;
  bannersEnabled: boolean;
  rewardedEnabled: boolean;
}

export interface TeacherCoursePricing {
  id: string;
  title: string;
  level: string;
  model: string;
  sales: number;
  price: number;
}

/** Sub-tab activo de la sección. */
export type MonetizationTab = "plans" | "admob" | "teacher";

/** Pasarela que se está inspeccionando en el mapeo de precios. */
export type GatewayFilter = "all" | "stripe" | "apple" | "google";
