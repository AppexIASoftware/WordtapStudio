"use client";

interface FeedbackTextRendererProps {
  text: string;
  className?: string;
  bulletColor?: string;
}

export function FeedbackTextRenderer({
  text,
  className = "",
  bulletColor = "text-amber-400",
}: FeedbackTextRendererProps) {
  if (!text) return null;

  // 1. Detectar si el texto tiene saltos de línea
  let items = text
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
          const cleanText = isBullet ? item.replace(/^[•\-\*]\s*/, "") : item;

          return (
            <li key={idx} className="flex items-start gap-2 leading-relaxed text-xs">
              <span className={`${bulletColor} font-bold flex-shrink-0 mt-0.5`}>•</span>
              <span className="text-slate-200">{cleanText}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  // 4. Párrafo normal pero preservando saltos de línea si existieran
  return (
    <p className={`text-slate-200 leading-relaxed whitespace-pre-line text-xs ${className}`}>
      {text}
    </p>
  );
}
