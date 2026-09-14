# Shaolin Personal Classes

Private-session booking for the Shaolin hall in Sepolia, Athens. Students choose a class type, take an open hour with Shi Ti Lin (释体林), and receive a confirmation code to bring to the hall.

## What you can do

- Browse personal class types: trial, Wu Gong, Qi Gong, Tai Ji, weapons, and kids coaching
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

Shaolin Temple Disciple’s Union · 84–86 Prevezis Street, 104 43 Athens · sepolia@shaolin.com.gr
