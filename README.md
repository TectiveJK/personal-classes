# Shaolin Temple Greece — Personal Classes

Private-session booking for [Shaolin Temple Greece 希腊少林寺](https://www.shaolintemplegreece.com), the authorised Shaolin Temple Cultural Center in Athens. Students choose a class type, take an open hour with Master Shi Yan Xiang (释延向), and receive a confirmation code to bring to the centre.

## What you can do

- Browse personal class types: trial, Shaolin Kung Fu, Chen Taiji, Qigong & Neigong, Gu Luin, and Chan
- See the next three weeks of private hours (Europe/Athens)
- Book a session with name, email, phone, and experience
- Look up or cancel a booking by confirmation code or email

Fees are listed in euros and paid at the hall. There is no payment processor in this app.

Bookings are stored in a local JSON file (`.data/bookings.json` when you run the app yourself, `/tmp` on Vercel). This is a working booking desk, not a multi-server database.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:4317](http://localhost:4317).

```bash
npm run build
npm start -- --port 4317
```

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui.

## School

Shaolin Temple Greece 希腊少林寺 · 84–86 Prevezis Street, 104 43 Athens · [www.shaolintemplegreece.com](https://www.shaolintemplegreece.com) · info@shaolintemplegreece.com
