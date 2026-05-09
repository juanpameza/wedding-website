"use client";
import React from "react";
import type { BasicFormField } from "@keystatic/core";

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const isValid = /^#[0-9A-Fa-f]{6}$/.test(value);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <input
        type="color"
        value={isValid ? value : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 44, height: 44, padding: 2, border: "1px solid #ccc", borderRadius: 6, cursor: "pointer" }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        style={{ fontFamily: "monospace", fontSize: 14, padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6, width: 110 }}
      />
      <div style={{ width: 44, height: 44, borderRadius: 6, backgroundColor: isValid ? value : "transparent", border: "1px solid #ccc" }} />
    </div>
  );
}

export function colorField(label: string): BasicFormField<string> {
  return {
    kind: "form" as const,
    label,
    Input({ value, onChange }) {
      return <ColorInput value={value} onChange={onChange} />;
    },
    defaultValue: () => "",
    parse(value) { return typeof value === "string" ? value : ""; },
    serialize(value) { return { value }; },
    validate(value) { return value; },
    reader: { parse(value) { return typeof value === "string" ? value : ""; } },
  };
}
