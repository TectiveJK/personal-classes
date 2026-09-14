import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs tracking-[0.22em] text-gold uppercase">Missing</p>
      <h1 className="font-heading mt-3 text-5xl">This page is not in the hall</h1>
      <p className="mt-4 text-muted-foreground">
        The booking or page you asked for is gone, cancelled, or never existed.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button render={<Link href="/" />}>Back to the hall</Button>
        <Button variant="outline" render={<Link href="/book" />}>
          Book a session
        </Button>
      </div>
    </div>
  );
}
