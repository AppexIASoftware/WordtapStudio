import { Suspense } from "react";
import { PageShellSkeleton } from "@/components/ui/page-skeleton";
import { Metadata } from "next";
import { AdminVaultView } from "@/features/vault/views/admin-vault-view";

export const metadata: Metadata = {
  title: "Content Vault — Wordtap Studio (Admin)",
  description: "Administración del banco de contenidos oficial que se publica en la app.",
};

export default function VaultPage() {
  return (
    <Suspense
      fallback={<PageShellSkeleton />}
    >
      <AdminVaultView />
    </Suspense>
  );
}
