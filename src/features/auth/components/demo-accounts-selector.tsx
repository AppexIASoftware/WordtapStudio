"use client";

import { UserRole } from "../types";
import { DEMO_ACCOUNTS } from "../hooks/use-login";

interface DemoAccountsSelectorProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export function DemoAccountsSelector({
  selectedRole,
  onSelectRole,
}: DemoAccountsSelectorProps) {
  const roles: UserRole[] = ["instructor", "moderator", "admin"];

  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold text-slate-subtle uppercase tracking-wider font-mono">
        Perfil a Simular:
      </label>
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-canvas rounded-2xl border border-border-default text-center">
        {roles.map((role) => {
          const account = DEMO_ACCOUNTS[role];
          const isSelected = selectedRole === role;

          return (
            <button
              key={role}
              type="button"
              onClick={() => onSelectRole(role)}
              className={`py-1.5 px-2 rounded-xl text-xs transition-all cursor-pointer ${
                isSelected
                  ? "font-bold bg-card border border-emerald-brand text-emerald-brand shadow-sm"
                  : "font-medium text-slate-muted hover:text-white bg-canvas/60 border border-transparent"
              }`}
            >
              {account.label}
            </button>
          );
        })}
      </div>
      <p className="text-[10px] text-slate-subtle font-mono px-1">
        {DEMO_ACCOUNTS[selectedRole].roleHint}
      </p>
    </div>
  );
}
