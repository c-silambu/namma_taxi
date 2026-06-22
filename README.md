# Namma Taxi — Updated UI Project

This project UI has been redesigned in a modern taxi booking website style inspired by the provided reference images.

## UI pages changed
- Home page / landing page
- Login page
- Register page
- Booking page
- My Trips / booking cards
- User dashboard views
- Driver login and driver dashboard
- Admin dashboard, tables, forms, cards, sidebar and buttons
- Navbar, footer, status badges, spacing, radius and shadows

## Dark / Light mode
- A theme toggle button is available in the navbar and dashboard layouts.
- The selected theme is stored in `localStorage` using the key `nammaTaxiTheme`.
- Theme colors are controlled from `src/context/ThemeContext.jsx` and `src/utils/styles.js`.

## Responsive design
- Layouts use responsive grids and flexible cards.
- Navbar switches to mobile menu on small screens.
- Cards, forms and tables adapt for mobile, tablet and desktop screens.
- No backend or API flow was changed.

## Run frontend
```bash
npm install
npm run dev
```
Frontend will run on:
```bash
http://localhost:5173
```

## Run backend
```bash
pip install -r requirements.txt
python app_api.py
```
Backend will run on:
```bash
http://127.0.0.1:5000
```

## New packages installed
No new frontend packages were added. Existing React + Vite setup is used.

## Important
Only UI design and brand text were changed. Existing backend functionality, API endpoints, booking flow, driver/admin/user logic and live booking update flow were kept unchanged.

## Updated route structure

Customer routes:
- `/login` - customer login
- `/signup` - customer signup
- `/book-trip` - customer booking page
- `/my-trips` - customer trip status, driver details and cancel reason

Hidden staff routes:
- `/driver/login` - driver login
- `/driver/panel` - driver dashboard
- `/admin/login` - admin login
- `/admin/dashboard` - admin dashboard

Navbar shows only public customer pages: Home, Tour Packages, Taxi Packages, Book Trip, Contact.
Admin and driver login pages are hidden separate URLs.

Booking updates:
- When driver accepts, customer can see driver name and phone number.
- Driver can see customer name and phone number.
- Customer and driver can cancel with a required reason.
- Admin trip table shows customer phone, driver phone, status and cancel reason.

## Latest changes added

- Booking form now shows customer name, mail ID and phone number first.
- Customer age field removed from the booking page.
- Booking vehicle selection now shows Mini, Sedan, 6 Seater and 7 Seater instead of showing car model first.
- Added Trip Type: One Way Trip, Return Trip and Hourly Rent.
- Added Drop Time field.
- Backend Trip model/API updated with vehicle_category, trip_type and drop_time.
- Added Cloudflare Turnstile `I am not a robot` verification for booking.
- Added admin service notification when a car reaches 12,000 km after last service.
- Admin can click Service Reset to restart the next 12,000 km count.
- Added floating mail icon on home page; hover shows `Let's Connect`, click opens Contact page.

## Turnstile setup

Create a Cloudflare Turnstile widget and add these env values:

Frontend `.env`:

```env
VITE_TURNSTILE_SITE_KEY=your_cloudflare_turnstile_site_key
```

Backend `.env`:

```env
TURNSTILE_SECRET_KEY=your_cloudflare_turnstile_secret_key
```

For local development, if keys are empty, the booking page shows a simple local checkbox.
