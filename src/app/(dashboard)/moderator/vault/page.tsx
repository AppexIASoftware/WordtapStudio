import { Suspense } from "react";
import { Metadata } from "next";
import { ModeratorVaultView } from "@/features/vault/views/moderator-vault-view";

export const metadata: Metadata = {
  title: "Content Vault Maestro — Wordtap Studio",
  description: "Auditoría de fonética, precisión sintáctica y verificación de calidad del banco global.",
};

export default function ModeratorVaultPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-slate-muted">
          Cargando banco de contenidos...
        </div>
      }
    >
      <ModeratorVaultView />
    </Suspense>
  );
}
