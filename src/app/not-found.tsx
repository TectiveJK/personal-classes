import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-heading text-4xl">Page not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        That screen is not in the Personal Training app.
      </p>
      <Button className="mt-6" render={<Link href="/" />}>
        Back to home
      </Button>
    </div>
  );
}
