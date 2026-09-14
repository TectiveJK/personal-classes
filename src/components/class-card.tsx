import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Discipline } from "@/lib/types";

export function ClassCard({ discipline }: { discipline: Discipline }) {
  return (
    <Card className="h-full bg-card/80">
      <CardHeader>
        <p className="text-xs tracking-[0.2em] text-gold uppercase">{discipline.chinese}</p>
        <CardTitle className="font-heading text-2xl">{discipline.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{discipline.level}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{discipline.summary}</p>
        <ul className="flex flex-wrap gap-2">
          {discipline.focus.map((item) => (
            <li
              key={item}
              className="rounded-full border border-gold/20 px-2.5 py-1 text-xs text-gold/90"
            >
              {item}
            </li>
          ))}
        </ul>
        <p className="text-sm">{discipline.who}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="text-sm">
          {discipline.durationMin} min · €{discipline.priceEur}
        </p>
        <Button render={<Link href={`/book?class=${discipline.slug}`} />}>Book</Button>
      </CardFooter>
    </Card>
  );
}
