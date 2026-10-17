"use client";

interface FeedbackTextRendererProps {
  text: string;
  className?: string;
  bulletColor?: string;
}

function sanitizeMojibake(input: string): string {
  if (!input) return "";
  let clean = input
    // Reemplazos de secuencias UTF-8 mal interpretadas como Latin-1
    .replace(/Ã¡/g, "á")
    .replace(/Ã©/g, "é")
    .replace(/Ã­/g, "í")
    .replace(/Ã³/g, "ó")
    .replace(/Ãº/g, "ú")
    .replace(/Ã±/g, "ñ")
    .replace(/Ã\u0081/g, "Á")
    .replace(/Ã\u0089/g, "É")
    .replace(/Ã\u008D/g, "Í")
    .replace(/Ã\u0093/g, "Ó")
    .replace(/Ã\u009A/g, "Ú")
    .replace(/Ã\u0091/g, "Ñ")
    .replace(/Ã¼/g, "ü")
    .replace(/Ãœ/g, "Ü")
    // Corrupciones de U+FFFD (carácter de reemplazo) o bytes nulos
    .replace(/transcripci[\uFFFD\?]+n/gi, "transcripción")
    .replace(/fon[\uFFFD\?]+tica/gi, "fonética")
    .replace(/pedag[\uFFFD\?]+gico/gi, "pedagógico")
    .replace(/lecci[\uFFFD\?]+n/gi, "lección")
    .replace(/oraci[\uFFFD\?]+n/gi, "oración")
    .replace(/categor[\uFFFD\?]+a/gi, "categoría")
    .replace(/[\uFFFD]/g, "");

  return clean;
}

export function FeedbackTextRenderer({
  text,
  className = "",
  bulletColor = "text-amber-600 dark:text-amber-400",
}: FeedbackTextRendererProps) {
  if (!text) return null;

  const sanitized = sanitizeMojibake(text);

  // 1. Detectar si el texto tiene saltos de línea
  let items = sanitized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // 2. Si vino en una sola línea pero contiene múltiples viñetas (ej. "• Ajuste 1. • Ajuste 2.")
  if (items.length === 1 && (items[0].includes(" • ") || items[0].startsWith("• "))) {
    const splitByBullet = items[0]
      .split(/(?:^|\s+)•\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (splitByBullet.length > 1) {
      items = splitByBullet.map((item) => `• ${item}`);
    }
  }

  // 3. Si hay múltiples elementos o líneas con viñetas
  const hasBullets = items.some((item) => /^[•\-\*]/.test(item));

  if (items.length > 1 || hasBullets) {
    return (
      <ul className={`space-y-1.5 ${className}`}>
        {items.map((item, idx) => {
          const isBullet = /^[•\-\*]/.test(item);
          const cleanItem = isBullet ? item.replace(/^[•\-\*]\s*/, "") : item;

          return (
            <li key={idx} className="flex items-start gap-2 leading-relaxed text-xs">
              <span className={`${bulletColor} font-bold flex-shrink-0 mt-0.5`}>•</span>
              <span className="text-slate-800 dark:text-slate-200">{cleanItem}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  // 4. Párrafo normal pero preservando saltos de línea si existieran
  return (
    <p className={`text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line text-xs ${className}`}>
      {sanitized}
    </p>
  );
}
