"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Smartphone,
  MessageSquare,
  AlertTriangle,
  Send,
  UserCheck,
  Check,
  ShieldCheck,
} from "lucide-react";
import { MODERATOR_PRS_DATA } from "../data/mock-moderator-data";
import { ModeratorPR } from "../types";

export function ModeratorApprovalsView() {
  const [prs, setPrs] = useState<ModeratorPR[]>(MODERATOR_PRS_DATA);
  const [activeTab, setActiveTab] = useState<"open" | "my" | "history">("my");
  const [selectedPrId, setSelectedPrId] = useState<string>("PR-108");

  // Modales
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);

  // Hilo de feedback pedagógico
  const [commentText, setCommentText] = useState("");
  const [thread, setThread] = useState<
    { sender: string; text: string; time: string; isMod: boolean }[]
  >([
    {
      sender: "Lic. Elena Ramos (Tú)",
      text: "Hola Mateo, revisé el vocabulario de la lección 3. Por favor ajusta la transcripción fonética de 'thought' a /θɔːt/ y añade un tip de par mínimo con 'through' para evitar tropiezos de alumnos.",
      time: "Hoy, 15:42",
      isMod: true,
    },
    {
      sender: "Prof. Mateo Silva (Docente)",
      text: "¡Hola Elena! Ya corregí la pronunciación a /θɔːt/ y agregué el tip fonético en la lección.",
      time: "Hace 20 min",
      isMod: false,
    },
  ]);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activePr = prs.find((p) => p.id === selectedPrId) || prs[0];

  const handleSendFeedback = () => {
    if (!commentText.trim()) return;
    setThread((prev) => [
      ...prev,
      {
        sender: "Lic. Elena Ramos (Tú)",
        text: commentText.trim(),
        time: "Justo ahora",
        isMod: true,
      },
    ]);
    setCommentText("");
    triggerToast("Feedback pedagógico enviado al docente Mateo Silva");
  };

  const handlePublishCourse = () => {
    setPrs((prev) =>
      prev.map((p) =>
        p.id === activePr.id
          ? { ...p, status: "approved", statusLabel: "Aprobado & Publicado" }
          : p
      )
    );
    setShowPublishModal(false);
    triggerToast(`¡Curso "${activePr.title}" aprobado y publicado en App Móvil!`);
  };

  const filteredPrs = prs.filter((p) => {
    if (activeTab === "open") return p.status === "open";
    if (activeTab === "my") return p.status === "in_review" || p.status === "changes_requested";
    return p.status === "approved";
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Toast flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-2.5 rounded-xl bg-slate-900 text-white border border-slate-700/80 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-200">
          <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Encabezado y Estadísticas de la Cola */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Cola de Moderación & Aprobaciones
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
              ADR-02 • Cola Abierta
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            Bandeja de verificación de precisión lingüística, fonética y jugabilidad antes de autorizar la publicación en la App móvil.
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

      {/* Banner de Modo Moderador (ADR-27) */}
      <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>
            <strong>Modo Moderador / Calidad:</strong> Los moderadores cuentan con autoridad plena para aprobar y desplegar cursos directamente a la app móvil (ADR-27).
          </span>
        </div>
        <Link
          href="/moderator/courses"
          className="px-3 py-1.5 rounded-xl bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-blue-600 transition-colors cursor-pointer flex-shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Simulador Playtest</span>
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
                ? "bg-blue-500 text-white font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Bandeja Abierta (Sin Asignar){" "}
            <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/20 text-white">
              {prs.filter((p) => p.status === "open").length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("my")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "my"
                ? "bg-blue-500 text-white font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Mis Revisiones Asignadas{" "}
            <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-border-default text-slate-300">
              {
                prs.filter(
                  (p) => p.status === "in_review" || p.status === "changes_requested"
                ).length
              }
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-blue-500 text-white font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Historial de Aprobaciones
          </button>
        </div>
      </div>

      {/* Tabla de Solicitudes */}
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
              {filteredPrs.map((pr) => {
                const isSelected = pr.id === selectedPrId;
                return (
                  <tr
                    key={pr.id}
                    onClick={() => setSelectedPrId(pr.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-blue-500/10" : "hover:bg-card-hover/40"
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
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                            : pr.status === "approved"
                            ? "bg-emerald-brand/20 text-emerald-brand border-emerald-brand/30"
                            : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {pr.statusLabel}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        className="px-3 py-1 rounded-lg bg-canvas border border-border-default hover:border-blue-400 text-blue-300 text-xs font-semibold cursor-pointer"
                      >
                        Auditar Diff
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECTOR DE DIFF PEDAGÓGICO VISUAL (ADR-12) & ACCIONES DE MODERADOR */}
      <div className="space-y-5 pt-2">
        <div className="p-5 rounded-2xl bg-card border border-border-default shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-mint-brand">{activePr.id}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {activePr.statusLabel}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">{activePr.title}</h3>
            <p className="text-xs text-slate-muted">
              Docente: <strong>{activePr.author}</strong> ({activePr.authorEmail}) • 2 cambios pedagógicos detectados
            </p>
          </div>

          {/* Botones de acción exclusiva de Moderador */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowReassignModal(true)}
              className="px-3 py-2 rounded-xl bg-canvas border border-border-default hover:border-blue-400 text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Reasignar</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPrs((prev) =>
                  prev.map((p) =>
                    p.id === activePr.id
                      ? { ...p, status: "changes_requested", statusLabel: "Correcciones Pedidas" }
                      : p
                  )
                );
                triggerToast("Notificación de correcciones enviada al docente");
              }}
              className="px-3.5 py-2 rounded-xl bg-card border border-amber-500/30 hover:border-amber-500 text-xs font-semibold text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Solicitar Correcciones</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPublishModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Aprobar y Publicar</span>
            </button>
          </div>
        </div>

        {/* Comparación Visual Side-by-Side de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Producción / Original */}
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
              <p className="text-[10px] text-slate-500 font-mono">Audio sintetizado v1 (desactualizado)</p>
            </div>
          </div>

          {/* Propuesta del Docente */}
          <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/40 space-y-3">
            <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
              <span className="font-mono text-blue-300 font-bold uppercase text-[10px]">
                Modificación Propuesta (Docente)
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                PR-108 Delta
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-blue-500/50 space-y-2 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">be</span>
                <span className="font-mono text-emerald-brand font-bold text-xs">
                  /biː/ (Fonética Corregida)
                </span>
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
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-bold text-white">
              Canal de Feedback Pedagógico con el Docente
            </h4>
          </div>

          <div className="space-y-3">
            {thread.map((msg, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  msg.isMod
                    ? "bg-blue-500/10 border-blue-500/30 ml-6"
                    : "bg-canvas border-border-default mr-6"
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <strong className={msg.isMod ? "text-blue-300" : "text-emerald-brand"}>
                    {msg.sender}
                  </strong>
                  <span className="text-slate-subtle font-mono text-[10px]">{msg.time}</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Formulario de envío de feedback */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Escribe un feedback pedagógico para el docente..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendFeedback();
              }}
              className="flex-1 px-3.5 py-2.5 bg-canvas border border-border-default rounded-xl text-xs text-white focus:outline-none focus:border-blue-400 placeholder-slate-500"
            />
            <button
              type="button"
              onClick={handleSendFeedback}
              className="px-4 py-2.5 rounded-xl bg-blue-500 text-white font-bold text-xs hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar Feedback</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: CONFIRMAR PUBLICACIÓN A PRODUCCIÓN */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-brand" />
                <span>Autorizar Publicación a Producción</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="text-slate-muted hover:text-white font-bold"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Estás a punto de aprobar el despliegue del curso:
            </p>
            <div className="p-3 rounded-xl bg-canvas border border-border-default font-bold text-white">
              {activePr.title}
            </div>

            <div className="space-y-2 p-3 bg-canvas rounded-xl border border-border-default text-[11px] text-slate-300">
              <div className="flex items-center gap-2 text-emerald-brand">
                <Check className="w-3.5 h-3.5" />
                <span>Precisión lingüística y fonética B1 verificada</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-brand">
                <Check className="w-3.5 h-3.5" />
                <span>Audios nativos probados sin saturación</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-brand">
                <Check className="w-3.5 h-3.5" />
                <span>Minijuegos y distractores validados en simulador</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-brand">
                <Check className="w-3.5 h-3.5" />
                <span>Despliegue instantáneo a CDN de WordTap Mobile</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handlePublishCourse}
                className="px-5 py-2 rounded-xl bg-emerald-brand text-canvas font-bold shadow-glow-emerald"
              >
                Confirmar & Publicar en App Móvil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REASIGNAR MODERADOR */}
      {showReassignModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span>Reasignar Revisor Pedagógico</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowReassignModal(false)}
                className="text-slate-muted hover:text-white font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-slate-200">Seleccionar Moderador:</label>
              <select
                id="reassign-moderator-select"
                className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 outline-none focus:border-blue-400"
              >
                <option value="Lic. Elena Ramos">Lic. Elena Ramos (Tú)</option>
                <option value="Prof. David Chen">Prof. David Chen (Especialista Fonética)</option>
                <option value="Bandeja Abierta">Devolver a Bandeja Abierta (Sin Asignar)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowReassignModal(false)}
                className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const sel = document.getElementById(
                    "reassign-moderator-select"
                  ) as HTMLSelectElement;
                  const newReviewer = sel?.value || "Lic. Elena Ramos";
                  setPrs((prev) =>
                    prev.map((p) => (p.id === activePr.id ? { ...p, reviewer: newReviewer } : p))
                  );
                  setShowReassignModal(false);
                  triggerToast(`Solicitud reasignada a: ${newReviewer}`);
                }}
                className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold"
              >
                Confirmar Reasignación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
