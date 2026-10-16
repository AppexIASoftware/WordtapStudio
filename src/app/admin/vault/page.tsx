import { Suspense } from "react";
import { Metadata } from "next";
import { AdminVaultView } from "@/features/vault/views/admin-vault-view";

export const metadata: Metadata = {
  title: "Content Vault — Wordtap Studio (Admin)",
  description: "Administración del banco de contenidos oficial que se publica en la app.",
};

export default function VaultPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs font-mono text-slate-muted">
          Cargando banco de contenidos...
        </div>
      }
    >
      <AdminVaultView />
    </Suspense>
  );
}
