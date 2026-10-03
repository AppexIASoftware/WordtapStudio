"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Download,
  Copy,
  Share2,
  AlertTriangle,
  Search,
  Sparkles,
  ExternalLink,
  Gift,
} from "lucide-react";
import { CLASSROOMS_DATA, GLOBAL_STUDENTS_DATA } from "../data/mock-teacher-data";
import { Classroom } from "../types";
import { ToastNotification } from "@/components/ui/toast-notification";

export function StudentsProgressView() {
  const [classrooms, setClassrooms] = useState<Classroom[]>(CLASSROOMS_DATA);
  const [selectedClassId, setSelectedClassId] = useState("cls-1");
  const selectedClass = classrooms.find((c) => c.id === selectedClassId) || classrooms[0];

  // Pestaña principal: cohorts | global
  const [mainTab, setMainTab] = useState<"cohorts" | "global">("cohorts");

  // Filtros de alumnos en cohorte
  const [cohortFilter, setCohortFilter] = useState<
    "all" | "subscription" | "trial" | "free" | "stumbled"
  >("all");
  const [cohortSearch, setCohortSearch] = useState("");

  // Filtro de alumnos globales
  const [globalSearch, setGlobalSearch] = useState("");

  // Modal Nueva Aula
  const [showNewClassModal, setShowNewClassModal] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      triggerToast(`¡Código ${code} copiado al portapapeles!`);
    } else {
      triggerToast(`Código: ${code}`);
    }
  };

  const shareWhatsApp = (name: string, code: string) => {
    const text = `¡Hola! Únete a mi aula privada "${name}" en WordTap con el código: ${code}`;
    if (typeof window !== "undefined") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  // Filtrado de alumnos de la cohorte
  const filteredStudents = selectedClass.students.filter((st) => {
    if (cohortFilter === "subscription" && st.payStatus !== "subscription") return false;
    if (cohortFilter === "trial" && st.payStatus !== "trial") return false;
    if (cohortFilter === "free" && st.payStatus !== "free") return false;
    if (cohortFilter === "stumbled" && parseInt(st.accuracy) >= 75) return false;

    if (cohortSearch.trim()) {
      const q = cohortSearch.toLowerCase();
      return st.name.toLowerCase().includes(q) || st.email.toLowerCase().includes(q);
    }
    return true;
  });

  // Filtrado de alumnos globales
  const filteredGlobalStudents = GLOBAL_STUDENTS_DATA.filter((st) => {
    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      return (
        st.name.toLowerCase().includes(q) ||
        st.email.toLowerCase().includes(q) ||
        st.course.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast flotante */}
      <ToastNotification message={toastMessage} variant="emerald" />

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Aulas & Estudiantes
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/30">
              ADR-03 Modelo Híbrido • ADR-23 Ritmo Libre & Autogestionado
            </span>
          </div>
          <p className="text-sm text-slate-muted mt-1">
            Gestión de cohortes privadas mediante códigos de invitación y telemetría de alumnos del catálogo global (ADR-03, ADR-13).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewClassModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold text-xs hover:bg-mint-brand transition-colors flex items-center gap-1.5 shadow-glow-emerald cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Crear Nueva Aula</span>
          </button>

          <button
            type="button"
            onClick={() => triggerToast("Exportando lista de estudiantes en formato CSV...")}
            className="px-3.5 py-2 rounded-xl bg-card border border-border-default hover:border-border-subtle text-xs font-medium text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Pestañas de Navegación Dual (ADR-03) */}
      <div className="flex items-center justify-between border-b border-border-default pb-3">
        <div className="flex items-center gap-1 bg-card p-1 rounded-2xl border border-border-default text-xs font-medium">
          <button
            type="button"
            onClick={() => setMainTab("cohorts")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              mainTab === "cohorts"
                ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Aulas Privadas & Cohortes{" "}
            <span
              className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                mainTab === "cohorts" ? "bg-black/20 text-white" : "bg-card text-slate-300"
              }`}
            >
              {classrooms.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMainTab("global")}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              mainTab === "global"
                ? "bg-emerald-brand text-canvas font-bold shadow-sm"
                : "text-slate-muted hover:text-white"
            }`}
          >
            Alumnos del Catálogo Global{" "}
            <span
              className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                mainTab === "global" ? "bg-black/20 text-white" : "bg-card text-slate-300"
              }`}
            >
              1,428
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-subtle font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-brand" />
          <span>Acceso de alumnos vinculado a Paywall (ADR-13)</span>
        </div>
      </div>

      {/* SUB-PESTAÑA 1: COHORTES Y AULAS PRIVADAS */}
      {mainTab === "cohorts" && (
        <div className="space-y-6">
          {/* Tarjetas de Aulas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classrooms.map((cls) => {
              const isSelected = cls.id === selectedClassId;
              return (
                <div
                  key={cls.id}
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`p-5 rounded-2xl bg-card shadow-sm space-y-4 relative cursor-pointer transition-all ${
                    isSelected
                      ? "border-2 border-emerald-brand/50 ring-1 ring-emerald-brand/30"
                      : "border border-border-default hover:border-emerald-brand/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        cls.level.includes("B1")
                          ? "bg-emerald-brand/20 text-emerald-brand border-emerald-brand/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      }`}
                    >
                      {cls.level}
                    </span>
                    <span className="text-[10px] text-slate-subtle font-mono">{cls.created}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{cls.name}</h3>
                    <p className="text-xs text-slate-muted mt-0.5">
                      {cls.studentsCount} estudiantes matriculados
                    </p>
                  </div>

                  {/* Caja de Código de Invitación con Copiar & Compartir */}
                  <div className="p-3 rounded-xl bg-canvas border border-border-default space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-subtle font-mono">Código de Invitación:</span>
                      <strong className="font-mono text-mint-brand text-xs tracking-wider">
                        {cls.code}
                      </strong>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyCode(cls.code);
                        }}
                        className="w-full py-1.5 rounded-lg bg-card border border-border-default hover:border-emerald-brand text-slate-200 hover:text-white text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copiar Código</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareWhatsApp(cls.name, cls.code);
                        }}
                        className="w-full py-1.5 rounded-lg bg-emerald-brand/10 border border-emerald-brand/30 text-emerald-brand hover:bg-emerald-brand/20 text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Desglose de estado de pago (ADR-13) */}
                  <div className="pt-2 border-t border-border-default flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-muted">Estado de Pago:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-brand font-bold">{cls.stats.sub} Sub</span>
                      <span className="text-amber-400">{cls.stats.trial} Trial</span>
                      <span className="text-slate-500">{cls.stats.free} Free</span>
                    </div>
                  </div>

                  {/* Curso Vinculado y Navegación Rápida */}
                  <div className="pt-2 border-t border-border-default/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300 truncate">
                      <span className="text-[10px] font-mono text-slate-muted uppercase">Curso:</span>
                      <span className="font-bold text-white text-xs truncate">
                        {cls.courseTitle}
                      </span>
                    </div>
                    <Link
                      href="/teacher/builder"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1 rounded-lg bg-emerald-brand/10 border border-emerald-brand/30 text-emerald-brand hover:bg-emerald-brand hover:text-canvas text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
                    >
                      <span>Editar</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stumble List: Diagnóstico Pedagógico del Aula (ADR-24) */}
          <div className="p-5 rounded-2xl bg-card border border-amber-500/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Diagnóstico del Aula: Lista de Tropiezos (Stumble List)</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      ADR-24
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-muted">
                    Términos y patrones donde los {selectedClass.studentsCount} alumnos de esta aula presentan más de 40% de fallos en minijuegos.
                  </p>
                </div>
              </div>

              <Link
                href="/teacher/builder"
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generar Sesión de Refuerzo en 1 Clic</span>
              </Link>
            </div>

            {/* Cuadrícula de tropiezos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              {selectedClass.stumble.map((st) => (
                <div
                  key={st.term}
                  className="p-3 rounded-xl bg-canvas border border-border-default space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{st.term}</span>
                    <span className="text-rose-400 font-bold text-[10px]">{st.failRate} Fallos</span>
                  </div>
                  <p className="text-[10px] text-slate-muted">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla de Alumnos de la Cohorte */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Estudiantes en el Aula: &apos;{selectedClass.name}&apos;</span>
              </h3>

              {/* Filtros de la tabla */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
                {[
                  { id: "all", label: "Todos", count: selectedClass.students.length },
                  {
                    id: "subscription",
                    label: "Suscripción / Pro",
                    count: selectedClass.stats.sub,
                  },
                  { id: "trial", label: "En Prueba", count: selectedClass.stats.trial },
                  { id: "free", label: "Gratuito / Free", count: selectedClass.stats.free },
                  { id: "stumbled", label: "Rezagados (<75%)", count: 2 },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() =>
                      setCohortFilter(
                        f.id as "all" | "subscription" | "trial" | "free" | "stumbled"
                      )
                    }
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      cohortFilter === f.id
                        ? "bg-canvas text-emerald-brand font-bold border border-emerald-brand/40 shadow-sm"
                        : "bg-card border border-border-default text-slate-muted hover:text-white"
                    }`}
                  >
                    {f.label} ({f.count})
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border-default rounded-2xl overflow-hidden shadow-sm">
              <div className="p-3.5 border-b border-border-default bg-card-hover/40 flex items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-subtle" />
                  <input
                    type="text"
                    placeholder="Buscar alumno por nombre o correo..."
                    value={cohortSearch}
                    onChange={(e) => setCohortSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-canvas rounded-xl border border-border-default text-xs text-white placeholder-slate-500 focus:border-emerald-brand outline-none"
                  />
                </div>
                <span className="text-xs font-mono text-slate-subtle">
                  Mostrando {filteredStudents.length} estudiantes
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Estudiante</th>
                      <th className="p-3.5">Nivel CEFR</th>
                      <th className="p-3.5">Racha & Palabras</th>
                      <th className="p-3.5">Precisión Minijuegos</th>
                      <th className="p-3.5">Estado Paywall (ADR-13)</th>
                      <th className="p-3.5">Última Actividad</th>
                      <th className="p-3.5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    {filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-card-hover/40 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-brand/20 text-emerald-brand flex items-center justify-center font-bold text-xs font-mono">
                              {st.initials}
                            </div>
                            <div>
                              <p className="font-bold text-white text-xs">{st.name}</p>
                              <p className="text-[10px] text-slate-subtle">{st.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-canvas border border-border-default text-slate-200">
                            {st.level}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-300">
                          <span className="font-semibold text-white">{st.streak}</span> •{" "}
                          <span className="text-slate-subtle">{st.words} palabras</span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-canvas rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  parseInt(st.accuracy) >= 80 ? "bg-emerald-brand" : "bg-amber-400"
                                }`}
                                style={{ width: st.accuracy }}
                              />
                            </div>
                            <span className="font-mono font-bold text-[11px] text-white">
                              {st.accuracy}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                              st.payStatus === "subscription"
                                ? "bg-emerald-brand/10 text-emerald-brand border-emerald-brand/20"
                                : st.payStatus === "trial"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                            }`}
                          >
                            {st.payLabel}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-muted text-[11px] font-mono">
                          {st.lastActive}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              triggerToast(
                                `Pase de cortesía (30 días) emitido para ${st.name}`
                              )
                            }
                            className="px-2.5 py-1 rounded-lg bg-emerald-brand/10 hover:bg-emerald-brand hover:text-canvas text-emerald-brand text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Otorgar Pase de Cortesía de Docente (ADR-13b)"
                          >
                            <Gift className="w-3 h-3" />
                            <span>Pase</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PESTAÑA 2: TELEMETRÍA DEL CATÁLOGO GLOBAL */}
      {mainTab === "global" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-card border border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-subtle" />
              <input
                type="text"
                placeholder="Buscar por nombre, correo o curso del catálogo..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-canvas border border-border-default rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-brand"
              />
            </div>
            <span className="text-xs font-mono text-slate-subtle">
              Total telemetría activa: <strong>1,428 estudiantes</strong>
            </span>
          </div>

          <div className="bg-card border border-border-default rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-card-hover/80 text-slate-subtle border-b border-border-default font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Estudiante Global</th>
                    <th className="p-3.5">Curso Inscrito</th>
                    <th className="p-3.5">Nivel CEFR</th>
                    <th className="p-3.5">Racha Actual</th>
                    <th className="p-3.5">Progreso</th>
                    <th className="p-3.5">Plan / Paywall</th>
                    <th className="p-3.5">Última Sesión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {filteredGlobalStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-card-hover/40 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs font-mono">
                            {st.initials}
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs">{st.name}</p>
                            <p className="text-[10px] text-slate-subtle">{st.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-200">{st.course}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-canvas border border-border-default text-slate-200">
                          {st.cefr}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-emerald-brand">{st.streak}</td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-canvas rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-brand rounded-full"
                              style={{ width: `${st.progress}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs text-white">{st.progress}%</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-brand/10 text-emerald-brand border border-emerald-brand/20">
                          {st.payLabel}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-muted text-[11px] font-mono">
                        {st.lastActive}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREAR NUEVA AULA */}
      {showNewClassModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border-default rounded-3xl p-6 text-xs space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-brand" />
                <span>Crear Nueva Aula Privada</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewClassModal(false)}
                className="text-slate-muted hover:text-white font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">Nombre del Aula</label>
                <input
                  type="text"
                  id="new-class-name"
                  placeholder="Ej: Inglés C1 - Conversación Avanzada"
                  className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-white outline-none focus:border-emerald-brand"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Nivel CEFR</label>
                <select
                  id="new-class-level"
                  className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 outline-none focus:border-emerald-brand"
                >
                  <option value="A1 Beginner">A1 Beginner</option>
                  <option value="A2 Elementary">A2 Elementary</option>
                  <option value="B1 Intermediate" selected>
                    B1 Intermediate
                  </option>
                  <option value="B2 Upper Intermediate">B2 Upper Intermediate</option>
                  <option value="C1 Advanced">C1 Advanced</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">
                  Curso Asociado para Contenidos
                </label>
                <select
                  id="new-class-course"
                  className="w-full px-3 py-2 bg-canvas border border-border-default rounded-xl text-slate-200 outline-none focus:border-emerald-brand"
                >
                  <option value="c-3">B1 Conversational Travel</option>
                  <option value="c-2">Curso Premium WordTap</option>
                  <option value="c-1">Inglés Básico Gratuito</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowNewClassModal(false)}
                className="px-4 py-2 rounded-xl bg-canvas border border-border-default text-slate-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const name =
                    (
                      document.getElementById("new-class-name") as HTMLInputElement
                    )?.value.trim() || "Nueva Aula";
                  const level =
                    (
                      document.getElementById("new-class-level") as HTMLSelectElement
                    )?.value || "B1 Intermediate";
                  const courseId =
                    (
                      document.getElementById("new-class-course") as HTMLSelectElement
                    )?.value || "c-3";

                  const newCode = `WT-${level.substring(0, 2).toUpperCase()}-${Math.floor(
                    1000 + Math.random() * 9000
                  )}`;

                  const newCls: Classroom = {
                    id: `cls-${Date.now()}`,
                    name,
                    code: newCode,
                    courseId,
                    courseTitle:
                      courseId === "c-3"
                        ? "B1 Conversational Travel"
                        : "Curso Premium WordTap",
                    level,
                    created: "Hoy",
                    studentsCount: 0,
                    stats: { sub: 0, trial: 0, free: 0, scholar: 0 },
                    stumble: [],
                    students: [],
                  };

                  setClassrooms((prev) => [newCls, ...prev]);
                  setSelectedClassId(newCls.id);
                  setShowNewClassModal(false);
                  triggerToast(`¡Aula "${name}" creada con código ${newCode}!`);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-brand text-canvas font-bold shadow-glow-emerald"
              >
                Crear Aula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
