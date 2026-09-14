<p align="center">
  <img src="public/logo-app.png" alt="Shaolin Temple Greece 希腊少林寺" width="280" />
</p>

# Shaolin Temple Greece — Personal Training

Live booking for the **Personal Training** class at [Shaolin Temple Greece 希腊少林寺](https://www.shaolintemplegreece.com) Cultural Center.

The class is strength and conditioning plus self-defense. Sessions are **Monday–Friday, 8:30 PM–9:30 PM**, with a **maximum of 6 students**. Students can see and book **every weekday in the current month**. When a student reserves a place, every other signed-in phone and the Admin Panel update immediately.

This repository is the student app (iPhone, iPad, Windows) and the connected Admin Panel.

## What students see

- The Shaolin Temple Greece logo on the home screen
- Create an account (required to book)
- Sign in from iPhone, iPad, or a Windows computer
- Each weekday this month with **booked / remaining / fully booked**
- Reserve or cancel their own place

## What you see (Admin Panel)

Sign in as administrator on your computer at `/admin` to:

- Watch occupancy for every session
- See which student booked which day and time
- Read student profiles (name, email, phone)
- Add or delete student accounts
- Release a place if needed

Student bookings and the admin board share the same live database.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:4317](http://localhost:4317).

For phones on the same Wi-Fi, use your computer’s local IP, for example `http://192.168.1.20:4317`. For students outside the house, host this app on a small always-on computer or a web host, then share that URL.

```bash
npm run build
npm start
```

## Install on phones and Windows

This is a web app (PWA), so one system works on every device:

- **Students (iPhone / iPad):** open the student link in **Safari** → Share → **Add to Home Screen**
- **Admin:** open the `/admin` link on your computer, then sign in
- **Windows:** Edge or Chrome → Install app / Add to desktop

### Default administrator

- Email: `admin@shaolintemplegreece.com`
- Password: `ShaolinAdmin2026`

Change these with `ADMIN_EMAIL` and `ADMIN_PASSWORD` before you go live. Set `AUTH_SECRET` to a long random string.

## How booking works

Each listed session is one hour, 8:30–9:30 PM:

- Monday
- Tuesday
- Wednesday
- Thursday
- Friday

Capacity is 6. Example: 3 booked → **3 places remaining**. At 6 booked the session is **fully booked** and the reserve button is closed.

The board shows every Monday–Friday in the **current month** (Athens time). Past days stay visible but cannot be booked.

Bookings are stored in `.data/shaolin.db` on the machine that runs the server. Real-time updates need that one server to stay running.

## School

Shaolin Temple Greece 希腊少林寺 · 84–86 Prevezis Street, 104 43 Athens · [www.shaolintemplegreece.com](https://www.shaolintemplegreece.com)
