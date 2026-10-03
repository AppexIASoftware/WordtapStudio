"use client";

import { useServerInsertedHTML } from "next/navigation";

const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("wordtap_theme")||"light";document.documentElement.classList.remove("light","dark");document.documentElement.classList.add(t);}catch(e){}`;

export function ThemeScript() {
  useServerInsertedHTML(() => (
    <script
      id="wordtap-theme-init"
      dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
    />
  ));
  return null;
}
