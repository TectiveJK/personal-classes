import { school } from "@/lib/school";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-gold/15">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-heading text-xl text-foreground">{school.name}</p>
          <p className="mt-1 text-sm text-gold/80">{school.chinese}</p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Private Shaolin instruction in Sepolia, Athens, in the lineage of the
            Shaolin Temple Disciple’s Union.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] text-gold uppercase">Hall</p>
          <p className="mt-2 text-sm text-muted-foreground">{school.address}</p>
          <p className="text-sm text-muted-foreground">{school.city}</p>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] text-gold uppercase">Contact</p>
          <p className="mt-2 text-sm">
            <a className="hover:text-gold" href={`mailto:${school.email}`}>
              {school.email}
            </a>
          </p>
          {school.phones.map((phone) => (
            <p key={phone} className="text-sm text-muted-foreground">
              <a className="hover:text-gold" href={`tel:${phone.replace(/\s/g, "")}`}>
                {phone}
              </a>
            </p>
          ))}
        </div>
      </div>
      <div className="ink-rule" />
      <p className="px-4 py-4 text-center text-xs text-muted-foreground">
        Established {school.founded} · {school.schoolName} · {school.schoolChinese}
      </p>
    </footer>
  );
}
