"use client";

import { useState } from "react";
import {
  AdminMonetizationConfig,
  AdMobConfig,
  TeacherCoursePricing,
  MonetizationTab,
} from "../types";
import {
  INITIAL_MONETIZATION_CONFIG,
  INITIAL_ADMOB_CONFIG,
  INITIAL_TEACHER_COURSES,
} from "../data/monetization-data";
import { ToastNotification } from "@/components/ui/toast-notification";
import { CoursePricingModal } from "../components/course-pricing-modal";
import { useUrlParam } from "@/hooks/use-url-params";
import { MonetizationHeader } from "../components/monetization-header";
import { PlansTab } from "../components/plans-tab";
import { AdmobTab } from "../components/admob-tab";
import { EarningsTab } from "../components/earnings-tab";

const MONETIZATION_TABS = ["plans", "admob", "teacher"] as const;

export function MonetizationView() {
  // La pestaña activa vive en la URL para que la vista sea compartible.
  const [activeTab, setActiveTab] = useUrlParam<"plans" | "admob" | "teacher">(
    "tab",
    MONETIZATION_TABS,
    "plans"
  );
  const [selectedGateway, setSelectedGateway] = useState<"all" | "stripe" | "apple" | "google">("stripe");

  // Configuración de Planes
  const [config, setConfig] = useState<AdminMonetizationConfig>(INITIAL_MONETIZATION_CONFIG);

  // Configuración de AdMob
  const [admob, setAdmob] = useState<AdMobConfig>(INITIAL_ADMOB_CONFIG);

  // Cursos Docente
  const [courses, setCourses] = useState<TeacherCoursePricing[]>(INITIAL_TEACHER_COURSES);
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<TeacherCoursePricing | null>(null);

  // Toast flotante
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Guardar y desplegar reglas canónicas
  const handleDeployRules = () => {
    triggerToast(
      `¡Reglas financieras sincronizadas! Sub: $${config.subPrice.toFixed(2)} USD • Split: ${config.teacherSplit}/${config.platformSplit}%`
    );
  };

  const handleSaveAdmobPolicy = () => {
    triggerToast(
      `¡Reglas de AdMob actualizadas! Intersticial: cada ${admob.interstitialFreq} juegos • Banners: ${
        admob.bannersEnabled ? "ON" : "OFF"
      } • Rewarded: ${admob.rewardedEnabled ? "ON" : "OFF"}`
    );
  };

  const handleSimulateAd = () => {
    triggerToast("Simulador: Disparando anuncio intersticial AdMob en vista móvil de prueba...");
  };

  const handleRequestPayout = () => {
    triggerToast(
      "Liquidación de $1,245.80 USD enviada a procesamiento con Stripe Connect. Depósito estimado en 24-48h."
    );
  };

  const handleSaveCoursePrice = (courseId: string, newPrice: number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, price: newPrice } : c))
    );
    const teacherCut = (newPrice * (config.teacherSplit / 100)).toFixed(2);
    triggerToast(
      `¡Precio actualizado! Precio: $${newPrice.toFixed(2)} USD (Recibes ${config.teacherSplit}%: $${teacherCut} USD)`
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Toast flotante */}
      <ToastNotification message={toastMessage} variant="purple" />

      <MonetizationHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onDeployRules={handleDeployRules}
      />

      {/* SUB-TAB 1: PLANES & PAYWALLS */}
      {activeTab === "plans" && (
        <PlansTab
          config={config}
          setConfig={setConfig}
          selectedGateway={selectedGateway}
          setSelectedGateway={setSelectedGateway}
          onDeployRules={handleDeployRules}
        />
      )}

      {/* SUB-TAB 2: PUBLICIDAD DINÁMICA ADMOB */}
      {activeTab === "admob" && (
        <AdmobTab
          admob={admob}
          setAdmob={setAdmob}
          onSavePolicy={handleSaveAdmobPolicy}
          onSimulateAd={handleSimulateAd}
          onToast={triggerToast}
        />
      )}

      {/* SUB-TAB 3: MIS GANANCIAS & STRIPE CONNECT */}
      {activeTab === "teacher" && (
        <EarningsTab
          config={config}
          courses={courses}
          onSelectCourse={setSelectedCourseForModal}
          onRequestPayout={handleRequestPayout}
        />
      )}

      {/* Modal de Precios de Curso */}
      <CoursePricingModal
        course={selectedCourseForModal}
        teacherSplitPct={config.teacherSplit}
        isOpen={selectedCourseForModal !== null}
        onClose={() => setSelectedCourseForModal(null)}
        onSave={handleSaveCoursePrice}
      />
    </div>
  );
}
