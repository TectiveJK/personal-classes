"use client";

import { useCallback, useEffect, useState } from "react";
import type { SessionView } from "@/lib/types";

export function useLiveSessions() {
  const [sessions, setSessions] = useState<SessionView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    try {
      const response = await fetch("/api/sessions", { cache: "no-store" });
      const data = (await response.json()) as { sessions?: SessionView[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not load sessions.");
      setSessions(data.sessions ?? []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load sessions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const source = new EventSource("/api/events");
    source.onopen = () => {
      void reload();
    };
    source.onmessage = () => {
      void reload();
    };
    const poll = setInterval(() => {
      void reload();
    }, 4000);
    return () => {
      source.close();
      clearInterval(poll);
    };
  }, [reload]);

  return { sessions, loading, error, reload, setSessions };
}
