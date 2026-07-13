"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  RSVP_EVENTS,
  type Attendance,
  type RsvpEventKey,
} from "@/lib/rsvp-events";
import { isUnnamedPlusOne, NAME_MAX, DIETARY_MAX } from "@/lib/rsvp-core";

// TODO: set this to the address guests should email if they can't find themselves.
const CONTACT_EMAIL = "planit4usv@gmail.com";

// Shape mirrors what /api/rsvp/search returns (lib/rsvp-core HouseholdRoster).
interface Member {
  id: string;
  firstName: string;
  name: string;
  isPlusOne: boolean;
  dietary: string;
  invitedEvents: RsvpEventKey[];
  responses: Record<RsvpEventKey, Attendance>;
}
interface Roster {
  householdId: string;
  householdName: string;
  members: Member[];
}

type LocalResponses = Record<string, Partial<Record<RsvpEventKey, Attendance>>>;

type Step = "search" | "picker" | "form" | "done";

export default function RsvpClient() {
  const [step, setStep] = useState<Step>("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Roster[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [roster, setRoster] = useState<Roster | null>(null);
  const [responses, setResponses] = useState<LocalResponses>({});
  const [names, setNames] = useState<Record<string, string>>({});
  const [diets, setDiets] = useState<Record<string, string>>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // ── Debounced search ──────────────────────────────────────────────
  useEffect(() => {
    if (step !== "search") return;
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearched(false);
      setSearchError(null);
      return;
    }

    const handle = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setSearching(true);
      setSearchError(null);
      try {
        const res = await fetch(`/api/rsvp/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Search failed");
        setResults(data.households ?? []);
        setSearched(true);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setSearchError("Something went wrong. Please try again.");
        }
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [query, step]);

  const selectRoster = useCallback((r: Roster) => {
    const seed: LocalResponses = {};
    const seedNames: Record<string, string> = {};
    const seedDiets: Record<string, string> = {};
    for (const m of r.members) {
      seed[m.id] = {};
      for (const ev of m.invitedEvents) {
        const current = m.responses[ev];
        if (current === "Yes" || current === "No") seed[m.id][ev] = current;
      }
      // An unnamed +1 starts blank so the guest types the real name in.
      seedNames[m.id] = isUnnamedPlusOne(m) ? "" : m.name;
      seedDiets[m.id] = m.dietary ?? "";
    }
    setRoster(r);
    setResponses(seed);
    setNames(seedNames);
    setDiets(seedDiets);
    setSubmitError(null);
    setStep("form");
  }, []);

  const setAnswer = (guestId: string, ev: RsvpEventKey, value: Attendance) => {
    setResponses((prev) => ({
      ...prev,
      [guestId]: { ...prev[guestId], [ev]: value },
    }));
  };

  const setName = (guestId: string, value: string) =>
    setNames((prev) => ({ ...prev, [guestId]: value }));

  const setDiet = (guestId: string, value: string) =>
    setDiets((prev) => ({ ...prev, [guestId]: value }));

  const submit = async () => {
    if (!roster) return;

    // If a +1 is coming to anything, we need their name for our records.
    const namelessAttending = roster.members.find(
      (m) =>
        m.isPlusOne &&
        !(names[m.id] ?? "").trim() &&
        Object.values(responses[m.id] ?? {}).includes("Yes"),
    );
    if (namelessAttending) {
      setSubmitError("Please add your guest's name so we have it on record.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const updates = roster.members.map((m) => ({
        guestId: m.id,
        responses: responses[m.id] ?? {},
        // Only +1 rows may carry a name; the server rejects it otherwise.
        ...(m.isPlusOne ? { name: names[m.id] ?? "" } : {}),
        dietary: diets[m.id] ?? "",
      }));
      const res = await fetch("/api/rsvp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ householdId: roster.householdId, updates }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data?.error ?? data?.errors?.[0] ?? "Could not save.");
      }
      setStep("done");
    } catch (err) {
      setSubmitError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto">
      {step === "search" && (
        <SearchStep
          query={query}
          setQuery={setQuery}
          searching={searching}
          searched={searched}
          results={results}
          error={searchError}
          onPick={selectRoster}
        />
      )}

      {step === "picker" && (
        <div>
          <p className="text-center mb-4">Which one is you?</p>
          {results.map((r) => (
            <RosterButton key={r.householdId} roster={r} onClick={() => selectRoster(r)} />
          ))}
          <BackLink onClick={() => setStep("search")} label="Search again" />
        </div>
      )}

      {step === "form" && roster && (
        <FormStep
          roster={roster}
          responses={responses}
          names={names}
          diets={diets}
          setAnswer={setAnswer}
          setName={setName}
          setDiet={setDiet}
          submit={submit}
          submitting={submitting}
          error={submitError}
          onBack={() => setStep("search")}
        />
      )}

      {step === "done" && roster && (
        <div className="text-center">
          <p className="section-heading mb-4">Thank you!</p>
          <p className="mb-6">
            We&rsquo;ve recorded the RSVP for {roster.householdName}. You can come
            back any time before the wedding to make changes.
          </p>
          <button className="btn-outline" onClick={() => setStep("form")}>
            Edit our RSVP
          </button>
        </div>
      )}
    </div>
  );
}

function SearchStep({
  query,
  setQuery,
  searching,
  searched,
  results,
  error,
  onPick,
}: {
  query: string;
  setQuery: (v: string) => void;
  searching: boolean;
  searched: boolean;
  results: Roster[];
  error: string | null;
  onPick: (r: Roster) => void;
}) {
  return (
    <div>
      <label className="block text-center mb-2" htmlFor="rsvp-search">
        Enter your name
      </label>
      <input
        id="rsvp-search"
        type="text"
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing your first or last name…"
        className="w-full px-4 py-3 mb-4 outline-none"
        style={{
          backgroundColor: "var(--color-bg-white)",
          border: "1px solid var(--color-border)",
          color: "var(--color-body)",
        }}
      />

      {searching && <p className="text-center">Searching…</p>}
      {error && <p className="text-center" style={{ color: "var(--color-heading-rose)" }}>{error}</p>}

      {!searching && results.length > 0 && (
        <div>
          {results.map((r) => (
            <RosterButton key={r.householdId} roster={r} onClick={() => onPick(r)} />
          ))}
        </div>
      )}

      {!searching && searched && results.length === 0 && !error && (
        <p className="text-center mt-4">
          We couldn&rsquo;t find that name.{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            style={{ color: "var(--color-heading-rose)", textDecoration: "underline" }}
          >
            Let us know
          </a>{" "}
          and we&rsquo;ll sort it out.
        </p>
      )}
    </div>
  );
}

function RosterButton({ roster, onClick }: { roster: Roster; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 mb-2 transition-colors"
      style={{
        backgroundColor: "var(--color-bg-white)",
        border: "1px solid var(--color-border)",
        color: "var(--color-body)",
      }}
    >
      <span className="font-semibold">{roster.householdName}</span>
      <span className="block text-sm" style={{ color: "var(--color-muted)" }}>
        {roster.members.map((m) => m.firstName || m.name).join(", ")}
      </span>
    </button>
  );
}

function FormStep({
  roster,
  responses,
  names,
  diets,
  setAnswer,
  setName,
  setDiet,
  submit,
  submitting,
  error,
  onBack,
}: {
  roster: Roster;
  responses: LocalResponses;
  names: Record<string, string>;
  diets: Record<string, string>;
  setAnswer: (guestId: string, ev: RsvpEventKey, value: Attendance) => void;
  setName: (guestId: string, value: string) => void;
  setDiet: (guestId: string, value: string) => void;
  submit: () => void;
  submitting: boolean;
  error: string | null;
  onBack: () => void;
}) {
  return (
    <div>
      <p className="section-heading mb-6">{roster.householdName}</p>

      {roster.members.map((member) => (
        <div
          key={member.id}
          className="mb-6 pb-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <p className="card-heading mb-3">
            {isUnnamedPlusOne(member)
              ? "Your guest (+1)"
              : member.name || member.firstName}
          </p>

          {member.isPlusOne && (
            <TextField
              id={`name-${member.id}`}
              label="Guest's name"
              value={names[member.id] ?? ""}
              onChange={(v) => setName(member.id, v)}
              placeholder="Who are you bringing?"
              maxLength={NAME_MAX}
            />
          )}

          {member.invitedEvents.length === 0 && (
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              No events to RSVP for.
            </p>
          )}
          {RSVP_EVENTS.filter((ev) => member.invitedEvents.includes(ev.key)).map(
            (ev) => {
              const value = responses[member.id]?.[ev.key];
              return (
                <div
                  key={ev.key}
                  className="flex items-center justify-between mb-2 gap-3"
                >
                  <span>
                    {ev.label}
                    <span className="block text-xs" style={{ color: "var(--color-muted)" }}>
                      {ev.date}
                    </span>
                  </span>
                  <span className="flex gap-2 flex-shrink-0">
                    <ToggleButton
                      active={value === "Yes"}
                      onClick={() => setAnswer(member.id, ev.key, "Yes")}
                      label="Yes"
                    />
                    <ToggleButton
                      active={value === "No"}
                      onClick={() => setAnswer(member.id, ev.key, "No")}
                      label="No"
                    />
                  </span>
                </div>
              );
            },
          )}

          <div className="mt-3">
            <TextField
              id={`diet-${member.id}`}
              label="Dietary restrictions (optional)"
              value={diets[member.id] ?? ""}
              onChange={(v) => setDiet(member.id, v)}
              placeholder="Allergies, vegetarian, etc."
              maxLength={DIETARY_MAX}
            />
          </div>
        </div>
      ))}

      {error && (
        <p className="text-center mb-3" style={{ color: "var(--color-heading-rose)" }}>
          {error}
        </p>
      )}

      <div className="flex items-center justify-between mt-6">
        <BackLink onClick={onBack} label="Not you?" />
        <button className="btn-outline" onClick={submit} disabled={submitting}>
          {submitting ? "Saving…" : "Submit RSVP"}
        </button>
      </div>
    </div>
  );
}

function TextField({
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
        className="w-full px-3 py-2 outline-none"
        style={{
          backgroundColor: "var(--color-bg-white)",
          border: "1px solid var(--color-border)",
          color: "var(--color-body)",
        }}
      />
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className="px-4 py-1 transition-colors"
      style={{
        border: "1px solid var(--color-btn-border)",
        backgroundColor: active ? "var(--color-heading-rose)" : "transparent",
        color: active ? "#fff" : "var(--color-heading-rose)",
      }}
    >
      {label}
    </button>
  );
}

function BackLink({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="text-sm underline"
      style={{ color: "var(--color-muted)" }}
    >
      {label}
    </button>
  );
}
