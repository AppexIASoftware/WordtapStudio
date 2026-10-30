"use client";

import { useEffect, useState } from "react";

export function useBuilderSimulation(
  onSelectLessonId: (id: string) => void,
  triggerToast: (msg: string) => void
) {
  const [activeCanvasTab, setActiveCanvasTab] = useState<"cards" | "games" | "preview" | "journey">("cards");
  const [simScreen, setSimScreen] = useState<"lesson" | "home" | "game">("lesson");
  const [simTier, setSimTier] = useState<"free" | "premium">("free");
  const [isSimLessonCompleted, setIsSimLessonCompleted] = useState(false);
  const [simGameMatched, setSimGameMatched] = useState<string[]>([]);
  const [simGameSelected, setSimGameSelected] = useState<string | null>(null);

  // La pestaña activa se restaura desde la URL ya hidratada, para no romper el
  // render estático de la página.
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("canvasTab");
    if (raw === "games" || raw === "preview" || raw === "journey") setActiveCanvasTab(raw);
  }, []);

  const toggleSimTier = () => setSimTier((value) => (value === "free" ? "premium" : "free"));

  const toggleSimLessonCompleted = () => {
    setIsSimLessonCompleted((value) => !value);
    triggerToast(!isSimLessonCompleted ? "¡Lección completada en simulador!" : "Progreso reiniciado");
  };

  const handleSelectSimLesson = (id: string) => {
    onSelectLessonId(id);
    setSimScreen("lesson");
  };

  const handleSimGameCardClick = (cardId: string, matchId: string) => {
    if (!simGameSelected) {
      setSimGameSelected(cardId);
      return;
    }
    const pairs: Record<string, string> = {
      "en-1": "es-1",
      "es-1": "en-1",
      "en-2": "es-2",
      "es-2": "en-2",
      "en-3": "es-3",
      "es-3": "en-3",
    };
    if (pairs[simGameSelected] === cardId) {
      setSimGameMatched((items) => [...items, matchId]);
      triggerToast("¡Pareja correcta! +15 XP");
    } else {
      triggerToast("Inténtalo de nuevo");
    }
    setSimGameSelected(null);
  };

  const handleResetSimGame = () => {
    setSimGameMatched([]);
    setSimGameSelected(null);
  };

  return {
    activeCanvasTab,
    simScreen,
    simTier,
    isSimLessonCompleted,
    simGameMatched,
    simGameSelected,
    setActiveCanvasTab,
    setSimScreen,
    toggleSimTier,
    toggleSimLessonCompleted,
    handleSelectSimLesson,
    handleSimGameCardClick,
    handleResetSimGame,
  };
}
