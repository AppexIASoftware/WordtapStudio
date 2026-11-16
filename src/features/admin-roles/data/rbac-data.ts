import { RbacModule, RbacMatrixState } from "../types";

export const RBAC_MODULES_DATA: RbacModule[] = [
  {
    moduleId: "learning",
    moduleName: "Consumo & Experiencia del Alumno",
    badge: "APP MÓVIL",
    badgeColor: "blue",
    permissions: [
      {
        key: "vault:consume_lessons",
        name: "Consumir lecciones y jugar minijuegos",
        desc: "Acceso a la ejecución interactiva de unidades de aprendizaje y gamificación.",
        student: { val: true, locked: true },
        instructor: { val: true, locked: true },
        moderator: { val: true, locked: true },
        admin: { val: true, locked: true },
      },
      {
        key: "notifications:inbox_prefs",
        name: "Recibir notificaciones y configurar preferencias",
        desc: "Bandeja de entrada, avisos de aulas y preferencias personales de alertas.",
        student: { val: true, locked: true },
        instructor: { val: true, locked: true },
        moderator: { val: true, locked: true },
        admin: { val: true, locked: true },
      },
    ],
  },
  {
    moduleId: "authoring",
    moduleName: "Autoría, Content Vault & Minijuegos",
    badge: "STUDIO AUTHORING",
    badgeColor: "emerald",
    permissions: [
      {
        key: "vault:author_items",
        name: "Crear y editar ítems en Content Vault",
        desc: "Gestión de vocabulario, frases contextuales, fonética y pares mínimos.",
        student: { val: false, locked: true },
        instructor: { val: true, locked: true },
        moderator: { val: true, locked: false },
        admin: { val: true, locked: true },
      },
      {
        key: "courses:create_drafts",
        name: "Crear cursos y lecciones en borrador",
        desc: "Apertura de nuevos borradores de cursos y lecciones en el editor.",
        student: { val: false, locked: true },
        instructor: { val: true, locked: true },
        moderator: { val: false, locked: false },
        admin: { val: true, locked: true },
      },
      {
        key: "courses:author_free_courses",
        name: "Publicar cursos gratuitos en catálogo",
        desc: "Permite crear cursos sin costo además de cursos de pago.",
        student: { val: false, locked: true },
        instructor: { val: false, locked: false },
        moderator: { val: false, locked: false },
        admin: { val: true, locked: true },
      },
      {
        key: "games:tune_levels",
        name: "Crear minijuegos y calibrar dificultad",
        desc: "Configuración de actividades lúdicas, tiempos de respuesta y niveles.",
        student: { val: false, locked: true },
        instructor: { val: true, locked: false },
        moderator: { val: true, locked: false },
        admin: { val: true, locked: true },
      },
    ],
  },
  {
    moduleId: "moderation",
    moduleName: "Moderación & Publicación",
    badge: "CALIDAD",
    badgeColor: "amber",
    permissions: [
      {
        key: "moderation:review_courses",
        name: "Revisar, aprobar o rechazar cursos pendientes",
        desc: "Evaluación pedagógica y publicación hacia el catálogo oficial.",
        student: { val: false, locked: true },
        instructor: { val: false, locked: true },
        moderator: { val: true, locked: false },
        admin: { val: true, locked: true },
      },
      {
        key: "moderation:manage_teacher_apps",
        name: "Evaluar postulaciones docentes",
        desc: "Revisión de solicitudes de nuevos instructores en la plataforma.",
        student: { val: false, locked: true },
        instructor: { val: false, locked: true },
        moderator: { val: true, locked: false },
        admin: { val: true, locked: true },
      },
    ],
  },
  {
    moduleId: "cohorts",
    moduleName: "Aulas Privadas & Alumnos",
    badge: "AULAS",
    badgeColor: "teal",
    permissions: [
      {
        key: "cohorts:create_classrooms",
        name: "Crear aulas privadas y generar códigos de acceso",
        desc: "Creación de grupos privados con códigos únicos de inscripción.",
        student: { val: false, locked: true },
        instructor: { val: true, locked: true },
        moderator: { val: false, locked: false },
        admin: { val: true, locked: true },
      },
      {
        key: "cohorts:view_own_students",
        name: "Consultar progreso de alumnos en aulas propias",
        desc: "Seguimiento de avance, lecciones completadas y vocabulario difícil.",
        student: { val: false, locked: true },
        instructor: { val: true, locked: true },
        moderator: { val: false, locked: true },
        admin: { val: true, locked: true },
      },
    ],
  },
  {
    moduleId: "notifications",
    moduleName: "Notificaciones & Difusión",
    badge: "COMUNICACIÓN",
    badgeColor: "blue",
    permissions: [
      {
        key: "notifications:classroom_broadcast",
        name: "Enviar avisos y vocabulario a aulas privadas",
        desc: "Despacho de recordatorios y palabras destacadas a estudiantes inscritos.",
        student: { val: false, locked: true },
        instructor: { val: true, locked: true },
        moderator: { val: false, locked: false },
        admin: { val: true, locked: true },
      },
      {
        key: "notifications:global_announcements",
        name: "Enviar anuncios globales a la plataforma",
        desc: "Difusión de comunicados generales a toda la comunidad de usuarios.",
        student: { val: false, locked: true },
        instructor: { val: false, locked: true },
        moderator: { val: true, locked: false },
        admin: { val: true, locked: true },
      },
    ],
  },
  {
    moduleId: "monetization",
    moduleName: "Monetización & Tarifas",
    badge: "COMERCIAL",
    badgeColor: "purple",
    permissions: [
      {
        key: "monetization:custom_course_price",
        name: "Fijar precio en cursos propios",
        desc: "Definición del valor comercial de cursos de autoría propia.",
        student: { val: false, locked: true },
        instructor: { val: true, locked: false },
        moderator: { val: false, locked: true },
        admin: { val: true, locked: true },
      },
      {
        key: "monetization:manage_platform_pricing",
        name: "Administrar configuración comercial y anuncios",
        desc: "Gestión global de parámetros de monetización y publicidad.",
        student: { val: false, locked: true },
        instructor: { val: false, locked: true },
        moderator: { val: false, locked: true },
        admin: { val: true, locked: true },
      },
    ],
  },
  {
    moduleId: "governance",
    moduleName: "Gobernanza & Administración",
    badge: "SEGURIDAD",
    badgeColor: "indigo",
    permissions: [
      {
        key: "governance:manage_staff_admins",
        name: "Integrar administradores y gestionar accesos de staff",
        desc: "Alta, promoción, suspensión y eliminación de cuentas del equipo autorizado.",
        student: { val: false, locked: true },
        instructor: { val: false, locked: true },
        moderator: { val: false, locked: true },
        admin: { val: true, locked: true },
      },
      {
        key: "students:view_directory",
        name: "Ver directorio global de alumnos y métricas",
        desc: "Acceso al listado de estudiantes, progreso por curso y ficha de detalle.",
        student: { val: false, locked: true },
        instructor: { val: false, locked: true },
        moderator: { val: false, locked: false },
        admin: { val: true, locked: true },
      },
      {
        key: "students:manage_status",
        name: "Suspender y reactivar cuentas de alumnos",
        desc: "Habilitación o bloqueo de acceso de estudiantes desde el panel de detalle.",
        student: { val: false, locked: true },
        instructor: { val: false, locked: true },
        moderator: { val: false, locked: false },
        admin: { val: true, locked: true },
      },
    ],
  },
];

export const RBAC_SETTING_KEY = "rbac_matrix_policies" as const;

export function buildInitialRbacState(): RbacMatrixState {
  const state: RbacMatrixState = {};
  RBAC_MODULES_DATA.forEach((mod) => {
    mod.permissions.forEach((perm) => {
      state[perm.key] = {
        student: { val: perm.student.val, locked: perm.student.locked },
        instructor: { val: perm.instructor.val, locked: perm.instructor.locked },
        moderator: { val: perm.moderator.val, locked: perm.moderator.locked },
        admin: { val: perm.admin.val, locked: perm.admin.locked },
      };
    });
  });
  return state;
}

export function mergeRbacState(rawJson?: string | null): RbacMatrixState {
  const base = buildInitialRbacState();
  if (!rawJson) return base;
  try {
    const parsed = JSON.parse(rawJson) as Record<string, Partial<Record<"student" | "instructor" | "moderator" | "admin", boolean>>>;
    const roles = ["student", "instructor", "moderator", "admin"] as const;
    for (const key of Object.keys(base)) {
      const savedRow = parsed[key];
      if (!savedRow) continue;
      for (const r of roles) {
        if (!base[key][r].locked && typeof savedRow[r] === "boolean") {
          base[key][r].val = savedRow[r] as boolean;
        }
      }
    }
  } catch {
    return base;
  }
  return base;
}

export function serializeRbacOverrides(state: RbacMatrixState): string {
  const payload: Record<string, Partial<Record<"student" | "instructor" | "moderator" | "admin", boolean>>> = {};
  const roles = ["student", "instructor", "moderator", "admin"] as const;
  for (const key of Object.keys(state)) {
    const row: Partial<Record<"student" | "instructor" | "moderator" | "admin", boolean>> = {};
    let hasConfigurable = false;
    for (const r of roles) {
      if (!state[key][r].locked) {
        row[r] = state[key][r].val;
        hasConfigurable = true;
      }
    }
    if (hasConfigurable) payload[key] = row;
  }
  return JSON.stringify(payload);
}
