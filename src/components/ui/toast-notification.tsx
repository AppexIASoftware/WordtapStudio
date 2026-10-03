"use client";

interface ToastNotificationProps {
  message: string | null;
  variant?: "emerald" | "blue" | "purple";
}

export function ToastNotification({
  message,
  variant = "emerald",
}: ToastNotificationProps) {
  if (!message) return null;

  const dotColor =
    variant === "blue"
      ? "bg-blue-400"
      : variant === "purple"
      ? "bg-purple-400"
      : "bg-emerald-brand";

  return (
    <div
      data-toast
      className="fixed bottom-6 right-6 z-[100] px-4 py-2.5 rounded-xl bg-slate-900 text-white border border-slate-700/80 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-200"
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 animate-pulse ${dotColor}`} />
      <span className="text-white">{message}</span>
    </div>
  );
}
