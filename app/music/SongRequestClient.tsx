"use client";

import { useState, type FormEvent } from "react";
import TextField from "@/components/TextField";
import { SONG_FIELD_MAX } from "@/lib/song-request-core";

export default function SongRequestClient({
  successMessage,
  errorMessage,
}: {
  successMessage: string;
  errorMessage: string;
}) {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    // Client gate mirrors the server: trimmed song + artist required.
    if (!song.trim() || !artist.trim()) {
      setError("Please tell us the song and who sings it.");
      return;
    }
    setSubmitting(true);
    setError(null);
    // Only messages we deliberately choose reach the guest — a raw network
    // TypeError ("Failed to fetch" on flaky venue Wi-Fi) must never surface.
    let guestMessage: string | null = null;
    try {
      const res = await fetch("/api/songs/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song, artist, requestedBy: name }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        // Rate-limit responses carry actionable guidance ("slow down") — the
        // generic CMS errorMessage would tell the guest to retry immediately,
        // the one thing that keeps them limited.
        if (res.status === 429 && typeof data?.error === "string") {
          guestMessage = data.error;
        }
        throw new Error("submit failed");
      }
      setDone(true);
    } catch {
      setError(guestMessage || errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSong("");
    setArtist("");
    setName("");
    setError(null);
    setDone(false);
  };

  if (done) {
    return (
      <div aria-live="polite" className="text-center">
        <p className="mb-4" style={{ color: "var(--color-body)" }}>
          {successMessage}
        </p>
        <div className="flex flex-col items-center gap-1">
          <a className="caption-link" href="#playlist">
            While you&rsquo;re here &mdash; press play {"↑"}
          </a>
          <button type="button" className="caption-link" onClick={reset}>
            Request another song
          </button>
          <a className="caption-link" href="/">
            Back to home {"→"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="max-w-md mx-auto text-left" onSubmit={submit} noValidate>
      <TextField
        id="song-title"
        label="Song"
        value={song}
        onChange={setSong}
        placeholder="La Incondicional"
        maxLength={SONG_FIELD_MAX}
      />
      <TextField
        id="song-artist"
        label="Artist"
        value={artist}
        onChange={setArtist}
        placeholder="Luis Miguel"
        maxLength={SONG_FIELD_MAX}
      />
      <TextField
        id="song-name"
        label="Your name (optional)"
        value={name}
        onChange={setName}
        placeholder="So we know who to thank"
        maxLength={SONG_FIELD_MAX}
      />

      <div aria-live="polite">
        {error && (
          <p
            className="text-center mb-3"
            style={{ color: "var(--color-heading-rose)" }}
          >
            {error}
          </p>
        )}
      </div>

      <div className="text-center mt-2">
        <button className="btn-outline" type="submit" disabled={submitting}>
          {submitting ? "Sending…" : "Send it to the DJ"}
        </button>
      </div>
    </form>
  );
}
