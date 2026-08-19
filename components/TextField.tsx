"use client";

// Labeled text input shared by the RSVP and song-request forms — extracted
// from RsvpClient so both restyle together (plan eng decision 2A).
export default function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div className="mb-3">
      <label
        className="block text-xs mb-1"
        htmlFor={id}
        style={{ color: "var(--color-muted)" }}
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="text-field-input w-full px-3 py-2 outline-none"
        style={{
          backgroundColor: "var(--color-bg-white)",
          border: "1px solid var(--color-border)",
          color: "var(--color-body)",
        }}
      />
    </div>
  );
}
