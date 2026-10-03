"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  MessageSquare,
  FileEdit,
  Send,
} from "lucide-react";
import { APPROVALS_QUEUE_DATA } from "../data/mock-teacher-data";
import { ApprovalRequest } from "../types";
import { ToastNotification } from "@/components/ui/toast-notification";

export function CourseApprovalsView() {
  const [prs] = useState<ApprovalRequest[]>(APPROVALS_QUEUE_DATA);
  const [activeTab, setActiveTab] = useState<"open" | "my" | "history">("my");
  const [selectedPrId, setSelectedPrId] = useState<string>("PR-108");

  // Feedback del docente
  const [commentText, setCommentText] = useState("");
  const [feedbackThread, setFeedbackThread] = useState<
    { sender: string; text: string; time: string; isTeacher: boolean }[]
  >([
    {
      sender: "Lic. Elena Ramos (Moderadora de Calidad)",
      text: "Hola Mateo, revisé el vocabulario de la lección 3. Por favor ajusta la transcripción fonética de 'thought' a /θɔːt/ y añade un tip de par mínimo con 'through' para evitar tropiezos de alumnos.",
      time: "Hoy, 15:42",
      isTeacher: false,
    },
  ]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    setFeedbackThread((prev) => [
      ...prev,
      {
        sender: "Prof. Mateo Silva (Tú)",
        text: commentText.trim(),
        time: "Justo ahora",
        isTeacher: true,
      },
    ]);
    setCommentText("");
    triggerToast("Respuesta enviada a la moderadora Elena Ramos");
  };

  const activePr = prs.find((p) => p.id === selectedPrId) || prs[0];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast flotante */}
      <ToastNotification message={toastMessage} variant="emerald" />

      {/* Encabezado y Estadísticas de la Cola */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Cola de Moderación & Aprobaciones
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
              ADR-02 • Cola Abierta
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            Bandeja abierta para verificación de precisión lingüística, pronunciación y jugabilidad antes de publicar en la App móvil.
          </p>
        </div>

        {/* Insignias de la cola */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-card border border-border-default flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-slate-muted">Pendientes:</span>
            <strong className="text-amber-400">2</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-card border border-border-default flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-slate-muted">En Revisión:</span>
            <strong className="text-blue-400">1</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-card border border-border-default flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-brand" />
            <span className="text-slate-muted">Publicadas:</span>
            <strong className="text-emerald-brand">24</strong>
          </div>
        </div>
      </div>

      {/* Banner de Modo Docente */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-base font-bold font-mono">ℹ</span>
          <span>
            <strong>Modo Docente:</strong> Visualizando el estado de tus solicitudes enviadas. Los moderadores autorizados toman y auditan tus cambios antes de publicarlos en el catálogo oficial.
          </span>
        </div>
        <Link
          href="/teacher/builder"
          className="px-3.5 py-1.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs flex items-center gap-1.5 hover:bg-mint-brand transition-colors cursor-pointer flex-shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Probar en Simulador</span>
        </Link>
      </div>

      {/* Pestañas de Navegación de la Cola */}
      <div className="flex items-center justify-between border-b border-border-default pb-3">
        <div className="flex items-center gap-1 bg-card p-1 rounded-2xl border border-border-default text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("open")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "open"
                ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Bandeja Abierta (Sin Asignar){" "}
            <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/20 text-white">
              2
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("my")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "my"
                ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Mis Solicitudes Enviadas{" "}
            <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-border-default text-slate-300">
              1
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Historial de Aprobaciones
          </button>
        </div>
      </div>

      {/* Tabla de Solicitudes de la Cola */}
      <div className="rounded-2xl bg-card border border-border-default overflow-hidden shadow-sm text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Solicitud</th>
                <th className="p-3.5">Curso / Rama</th>
                <th className="p-3.5">Docente Autor</th>
                <th className="p-3.5">Espera</th>
                <th className="p-3.5">Cambios</th>
                <th className="p-3.5">Asignado a</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {prs.map((pr) => {
                const isSelected = pr.id === selectedPrId;
                return (
                  <tr
                    key={pr.id}
                    onClick={() => setSelectedPrId(pr.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-emerald-brand/5" : "hover:bg-card-hover/40"
                    }`}
                  >
                    <td className="p-3.5 font-bold font-mono text-mint-brand">{pr.id}</td>
                    <td className="p-3.5 font-semibold text-white">{pr.title}</td>
                    <td className="p-3.5 text-slate-300">{pr.author}</td>
                    <td className="p-3.5 font-mono text-slate-muted">{pr.waitHours}</td>
                    <td className="p-3.5 text-slate-300">{pr.changesCount}</td>
                    <td className="p-3.5 text-slate-300">{pr.reviewer}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          pr.status === "in_review"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : pr.status === "approved"
                            ? "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/20"
                            : "bg-amber-500/10 text-amber-300 border-amber-500/20"
                        }`}
                      >
                        {pr.statusLabel}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        className="px-3 py-1 rounded-lg bg-canvas border border-border-default hover:border-emerald-brand text-emerald-brand text-xs font-semibold cursor-pointer"
                      >
                        Ver Diff
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECTOR DE DIFF PEDAGÓGICO VISUAL (ADR-12) */}
      <div className="space-y-5 pt-2">
        <div className="p-5 rounded-2xl bg-card border border-border-default shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-mint-brand">{activePr.id}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {activePr.statusLabel}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">{activePr.title}</h3>
            <p className="text-xs text-slate-muted">
              Revisor asignado: <strong>{activePr.reviewer}</strong> • 2 cambios pedagógicos detectados
            </p>
          </div>

          <Link
            href="/teacher/builder"
            className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Abrir en Creador para Corregir</span>
          </Link>
        </div>

        {/* Comparación Visual Side-by-Side de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Versión Original (Producción) */}
          <div className="p-5 rounded-2xl bg-canvas border border-border-default space-y-3">
            <div className="flex items-center justify-between border-b border-border-default pb-2">
              <span className="font-mono text-slate-subtle font-bold uppercase text-[10px]">
                Producción / Original
              </span>
              <span className="px-2 py-0.5 rounded bg-card text-slate-400 font-mono text-[10px]">
                v1.2.0
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border-default space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">be</span>
                <span className="font-mono text-rose-400 line-through text-xs">/bi/</span>
              </div>
              <p className="text-slate-300">ser / estar</p>
              <p className="text-[11px] text-slate-400 italic">&quot;I am happy&quot;</p>
              <p className="text-[10px] text-slate-500">Audio sintetizado v1</p>
            </div>
          </div>

          {/* Versión Propuesta (Cambios del Docente) */}
          <div className="p-5 rounded-2xl bg-emerald-brand/5 border border-emerald-brand/40 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-brand/20 pb-2">
              <span className="font-mono text-emerald-brand font-bold uppercase text-[10px]">
                Propuesta de Cambio (Docente)
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-brand/20 text-emerald-brand font-mono text-[10px] font-bold">
                PR-108 Delta
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-emerald-brand/50 space-y-2 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">be</span>
                <span className="font-mono text-emerald-brand font-bold text-xs">/biː/ (Corregido)</span>
              </div>
              <p className="text-slate-200">ser / estar</p>
              <p className="text-[11px] text-slate-300 italic">&quot;I am happy today&quot;</p>
              <p className="text-[10px] text-mint-brand font-mono">
                + Audio nativo de alta resolución incorporado
              </p>
            </div>
          </div>
        </div>

        {/* Hilo de Feedback Pedagógico & Respuestas */}
        <div className="p-5 rounded-2xl bg-card border border-border-default space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border-default pb-3">
            <MessageSquare className="w-4 h-4 text-emerald-brand" />
            <h4 className="text-sm font-bold text-white">
              Feedback Pedagógico del Revisor
            </h4>
          </div>

          <div className="space-y-3">
            {feedbackThread.map((msg, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  msg.isTeacher
                    ? "bg-emerald-brand/10 border-emerald-brand/30 ml-6"
                    : "bg-canvas border-border-default mr-6"
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <strong className={msg.isTeacher ? "text-emerald-brand" : "text-amber-300"}>
                    {msg.sender}
                  </strong>
                  <span className="text-slate-subtle font-mono text-[10px]">{msg.time}</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Formulario de respuesta */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Escribe tu aclaración o confirmación para la moderadora..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendComment();
              }}
              className="flex-1 px-3.5 py-2.5 bg-canvas border border-border-default rounded-xl text-xs text-white focus:outline-none focus:border-emerald-brand placeholder-slate-500"
            />
            <button
              type="button"
              onClick={handleSendComment}
              className="px-4 py-2.5 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
