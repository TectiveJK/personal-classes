"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CancelButton({ code }: { code: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function cancel() {
    setPending(true);
    try {
      const response = await fetch(`/api/bookings/${code}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not cancel.");
      toast.success("Session released.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button variant="destructive" disabled={pending} onClick={() => void cancel()}>
      {pending ? "Releasing…" : "Cancel this session"}
    </Button>
  );
}
