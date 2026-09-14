import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClassCard } from "@/components/class-card";
import { Seal } from "@/components/seal";
import { disciplines, packs, primaryInstructor, school } from "@/lib/school";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="font-seal text-sm tracking-[0.35em] text-gold">{school.chinese}</p>
            <h1 className="font-heading mt-4 text-5xl leading-[0.95] text-balance sm:text-7xl">
              Private Shaolin training in Athens
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              {school.tagline} Work directly with {primaryInstructor.dharmaName}{" "}
              {primaryInstructor.chinese} — {primaryInstructor.generation} — in the Sepolia hall.
              No crowded lines. Correction you can feel.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" render={<Link href="/book" />}>
                Reserve a private session
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/schedule" />}>
                See open times
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              {school.address} · paid at the hall · cancel up to four hours before
            </p>
          </div>
          <div className="relative rounded-2xl border border-gold/25 bg-card/60 p-8">
            <Seal className="mx-auto size-28 text-gold" />
            <blockquote className="font-heading mt-6 text-center text-2xl leading-snug">
              “The way is not in the sky. The way is in the heart.”
            </blockquote>
            <p className="mt-4 text-center text-sm tracking-[0.18em] text-gold uppercase">
              Shaolin Temple Disciple’s Union
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-3 text-center">
              <Stat value="2008" label="Hall opened" />
              <Stat value="1:1" label="Private only" />
              <Stat value="21d" label="Open calendar" />
            </dl>
          </div>
        </div>
      </section>

      <div className="ink-rule" />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.22em] text-gold uppercase">The work</p>
            <h2 className="font-heading mt-2 text-4xl">Personal classes</h2>
          </div>
          <Button variant="outline" render={<Link href="/classes" />}>
            All class types
          </Button>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {disciplines.slice(0, 3).map((discipline) => (
            <ClassCard key={discipline.slug} discipline={discipline} />
          ))}
        </div>
      </section>

      <section className="border-y border-gold/15 bg-card/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.22em] text-gold uppercase">Shifu</p>
            <h2 className="font-heading mt-2 text-4xl">
              {primaryInstructor.dharmaName}{" "}
              <span className="text-gold">{primaryInstructor.chinese}</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {primaryInstructor.civicName} · {primaryInstructor.generation}
            </p>
            <p className="mt-6 max-w-xl leading-7 text-muted-foreground">
              {primaryInstructor.bio}
            </p>
          </div>
          <div className="rounded-2xl border border-gold/20 p-6">
            <p className="text-xs tracking-[0.22em] text-gold uppercase">How booking works</p>
            <ol className="mt-5 space-y-4">
              <Step n="01" title="Choose the art" body="Wu Gong, Qi Gong, Tai Ji, weapons, kids, or a first trial." />
              <Step n="02" title="Take an open hour" body="The calendar shows the next three weeks in Athens time. One student per slot." />
              <Step n="03" title="Arrive ready" body="Pay at the hall. Bring water and loose clothes. We hold the time until four hours before." />
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs tracking-[0.22em] text-gold uppercase">Training cycles</p>
        <h2 className="font-heading mt-2 text-4xl">Session packs</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Single sessions are booked here. Packs are arranged at the hall after your first private
          — same method, steadier progress.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {packs.map((pack) => (
            <div key={pack.name} className="rounded-xl border border-border bg-card p-6">
              <p className="font-heading text-2xl">{pack.name}</p>
              <p className="mt-2 text-3xl text-gold">€{pack.priceEur}</p>
              <p className="mt-2 text-sm text-muted-foreground">{pack.note}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-heading text-2xl text-gold">{value}</dt>
      <dd className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dd>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="flex gap-4">
      <span className="font-heading text-xl text-gold">{n}</span>
      <span>
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </span>
    </li>
  );
}
