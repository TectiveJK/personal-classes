import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";
import { findUserById, toPublicUser } from "@/lib/db";
import { myBookings } from "@/lib/bookings";
import { formatLongDate } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/");
  if (session.role === "admin") redirect("/admin");
  const user = findUserById(session.sub);
  if (!user) redirect("/");
  const bookings = myBookings(user.id);

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader user={toPublicUser(user)} />
      <div className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
        <p className="text-xs tracking-[0.2em] text-gold uppercase">Profile</p>
        <h1 className="font-heading mt-1 text-4xl">{user.name}</h1>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>{user.email}</p>
            <p>{user.phone}</p>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Your places</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">You have not reserved a session yet.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {bookings.map((booking) => (
                  <li key={booking.id}>
                    {booking.weekday} · {formatLongDate(booking.sessionDate)} · {booking.startLabel}
                    –{booking.endLabel}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
