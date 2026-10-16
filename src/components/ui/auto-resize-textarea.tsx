"use client";

import React, { useEffect, useRef } from "react";

interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  minHeight?: number;
}

export function AutoResizeTextarea({
  value,
  minHeight = 44,
  className = "",
  onChange,
  ...props
}: AutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const nextHeight = Math.max(minHeight, el.scrollHeight);
    el.style.height = `${nextHeight}px`;
  };

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [value, minHeight]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    resize();
    onChange?.(e);
  };

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      value={value}
      onChange={handleChange}
      className={`overflow-hidden resize-none transition-[height] duration-100 ${className}`}
      {...props}
    />
  );
}
