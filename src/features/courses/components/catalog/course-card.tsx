"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Crown,
  Gift,
  DollarSign,
  Globe2,
  User,
  CheckCircle2,
  UploadCloud,
  FileText,
  Clock,
} from "lucide-react";
import { ApiCourse } from "@/services/api";

interface CourseCardProps {
  course: ApiCourse;
  returnUrl?: string;
  onEditPricing?: (course: ApiCourse) => void;
  onTogglePublish?: (course: ApiCourse) => void;
}

export function CourseCard({ course, returnUrl, onEditPricing, onTogglePublish }: CourseCardProps) {
  const isSubscription = course.access_tier === "subscription";
  const isFree = course.access_tier === "free" || (!course.price_cents && !isSubscription);
  const price = (course.price_cents ?? 0) / 100;
  const isTeacher = course.owner_type === "teacher";
  const isPublished = course.status === "published";
  const isInReview = course.status === "in_review";
  const lessonCount = course.lessons?.length ?? 0;

  return (
    <div className="bg-card border border-border-default hover:border-emerald-brand/50 rounded-2xl p-5 shadow-card-soft transition-all duration-200 hover:shadow-xl hover:translate-y-[-2px] flex flex-col justify-between group relative overflow-hidden text-xs space-y-4">
      {/* Barra superior de acento */}
      <div
        className={`h-1 w-full absolute top-0 left-0 ${
          isSubscription
            ? "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"
            : isFree
            ? "bg-gradient-to-r from-emerald-brand via-mint-brand to-emerald-dark"
            : "bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600"
        }`}
      />

      {/* Cabecera de la tarjeta: Nivel, Tier y Estado */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Nivel CEFR */}
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-canvas border border-border-default text-emerald-brand uppercase tracking-wider">
            Nivel {course.level || "A1"}
          </span>

          {/* Badge de Monetización / Acceso */}
          {isSubscription ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold shadow-xs">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Suscripción Pro</span>
            </span>
          ) : isFree ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-semibold">
              <Gift className="w-3 h-3 text-emerald-400" />
              <span>Prueba Gratis</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold">
              <DollarSign className="w-3 h-3 text-purple-400" />
              <span>${price.toFixed(2)} USD</span>
            </span>
          )}
        </div>

        {/* Título y Descripción */}
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-brand transition-colors line-clamp-1 leading-tight">
            {course.title}
          </h3>
          <p className="text-[11px] text-slate-muted line-clamp-2 mt-1 leading-relaxed min-h-[32px]">
            {course.description || "Curso interactivo de vocabulario y expresiones contextuales."}
          </p>
        </div>
      </div>

      {/* Métricas y Datos Pedagógicos */}
      <div className="pt-3 border-t border-border-default/60 space-y-2">
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300">
          <div className="flex items-center gap-1.5 truncate">
            <BookOpen className="w-3.5 h-3.5 text-slate-subtle flex-shrink-0" />
            <span>{lessonCount} lección{lessonCount === 1 ? "" : "es"}</span>
          </div>

          <div className="flex items-center gap-1.5 truncate">
            <Globe2 className="w-3.5 h-3.5 text-slate-subtle flex-shrink-0" />
            <span className="uppercase font-semibold">
              {course.target_lang || "en"} → {course.source_lang || "es"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-subtle pt-1">
          <div className="flex items-center gap-1.5 truncate max-w-[150px]">
            <User className="w-3 h-3 text-slate-subtle flex-shrink-0" />
            <span className="truncate">{course.author?.name || (isTeacher ? "Docente" : "Wordtap Core")}</span>
          </div>

          {/* Insignia de Estado Real */}
          {isPublished ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[9px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Publicado (Live)</span>
            </span>
          ) : isInReview ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-mono text-[9px] font-semibold">
              <Clock className="w-2.5 h-2.5" />
              <span>En Revisión</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/15 border border-slate-500/20 text-slate-400 font-mono text-[9px] font-semibold">
              <FileText className="w-2.5 h-2.5" />
              <span>Borrador</span>
            </span>
          )}
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="pt-2 flex items-center gap-2">
        <Link
          href={
            returnUrl
              ? `/admin/courses/${course.id}?from=${encodeURIComponent(returnUrl)}`
              : `/admin/courses/${course.id}`
          }
          className="flex-1 py-2 px-3 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all group-hover:bg-emerald-brand group-hover:text-canvas cursor-pointer shadow-xs"
        >
          <span>Entrar al Editor</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* Botón rápido para Publicar / Despublicar en 1 clic */}
        {onTogglePublish && (
          <button
            type="button"
            onClick={() => onTogglePublish(course)}
            className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
              isPublished
                ? "bg-canvas border-border-default hover:border-rose-500/40 text-slate-400 hover:text-rose-400"
                : "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 font-bold"
            }`}
            title={isPublished ? "Despublicar curso (volver a borrador)" : "Publicar curso inmediatamente en la app móvil"}
          >
            {isPublished ? (
              <FileText className="w-3.5 h-3.5" />
            ) : (
              <UploadCloud className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {isPublished ? "Borrador" : "Publicar"}
            </span>
          </button>
        )}

        {onEditPricing && (
          <button
            type="button"
            onClick={() => onEditPricing(course)}
            className="p-2 rounded-xl bg-canvas border border-border-default hover:border-emerald-brand text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Cambiar tarifa / modelo Pro"
          >
            {isSubscription ? (
              <Crown className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Gift className="w-3.5 h-3.5 text-emerald-brand" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
