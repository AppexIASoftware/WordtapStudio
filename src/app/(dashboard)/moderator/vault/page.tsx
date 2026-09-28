import { Metadata } from "next";
import { ModeratorVaultView } from "@/features/moderator-dashboard/views/moderator-vault-view";

export const metadata: Metadata = {
  title: "Content Vault Maestro — Wordtap Studio",
  description: "Auditoría de fonética, precisión sintáctica y verificación de calidad del banco global.",
};

export default function ModeratorVaultPage() {
  return <ModeratorVaultView />;
}
