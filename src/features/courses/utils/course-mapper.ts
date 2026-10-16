import { Lesson, LessonItem } from "@/features/courses/types";;
import { ApiLesson } from "@/services/api";

export function mapApiLessonToLesson(apiLesson: ApiLesson): Lesson {
  const items: LessonItem[] = (apiLesson.items && apiLesson.items.length > 0)
    ? apiLesson.items.map((it) => {
        const bankItemId = it.content_bank_item_id || it.content_bank_item?.id || null;

        if (it.content_text) {
          try {
            const parsed = JSON.parse(it.content_text);
            if (parsed && typeof parsed === "object" && (parsed.en || parsed.es)) {
              return {
                id: it.id,
                contentBankItemId: bankItemId || parsed.contentBankItemId || null,
                en: parsed.en || "Term",
                es: parsed.es || "Significado",
                ipa: parsed.ipa || "",
                pos: parsed.pos || "",
                example: parsed.example || "",
                note: parsed.note || "",
                noteType: parsed.noteType || "bulb",
                itemType: parsed.itemType || it.item_type || "word",
              };
            }
          } catch {
            // Non-JSON content text fallback handled below
          }
        }

        if (it.content_bank_item) {
          return {
            id: it.id,
            contentBankItemId: it.content_bank_item.id,
            en: it.content_bank_item.target_text,
            es: it.content_bank_item.prompt_text,
            ipa: it.content_bank_item.ipa || "",
            pos: it.content_bank_item.bank_type,
            example: it.content_bank_item.explanation || "",
            note: "Importado de Content Vault",
            noteType: "bulb",
            itemType: it.content_bank_item.bank_type === "phrase" ? "phrase" : "word",
          };
        }

        if (it.vocabulary_item) {
          return {
            id: it.id,
            contentBankItemId: bankItemId,
            en: it.vocabulary_item.english || "Term",
            es: it.vocabulary_item.spanish || "Significado",
            ipa: it.vocabulary_item.pronunciation || "",
            pos: it.vocabulary_item.part_of_speech || "Verbo",
            example: it.vocabulary_item.example_sentence || "",
            note: it.vocabulary_item.definition || (it.content_text || ""),
            noteType: "bulb",
            itemType: "word",
          };
        }

        if (it.phrase) {
          return {
            id: it.id,
            contentBankItemId: bankItemId,
            en: it.phrase.english || "Phrase",
            es: it.phrase.spanish || "Frase",
            ipa: "",
            pos: "Frase",
            example: "",
            note: it.phrase.explanation || (it.content_text || ""),
            noteType: "info",
            itemType: "phrase",
          };
        }

        if (it.content_text) {
          const parts = it.content_text.split("-");
          return {
            id: it.id,
            contentBankItemId: bankItemId,
            en: parts[0]?.trim() || it.content_text,
            es: parts[1]?.trim() || "",
            itemType: it.item_type || "word",
          };
        }

        return {
          id: it.id,
          contentBankItemId: bankItemId,
          en: "Vocabulary",
          es: "Traducción",
          itemType: it.item_type || "word",
        };
      })
    : [];

  return {
    id: apiLesson.id,
    title: apiLesson.title,
    subtitle: apiLesson.description || "Objetivo pedagógico de la lección",
    duration: `${apiLesson.estimated_minutes || 10} min`,
    tier: apiLesson.access_tier || "Draft",
    isPublished: apiLesson.status === "published",
    intro: apiLesson.description || "Bienvenido a esta lección.",
    sectionTitle: "Vocabulario clave",
    items,
  };
}
