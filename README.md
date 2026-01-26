<p align="center">
   <img src="voya/src/img//logo_deitada.png" alt="Voya Logo" width="100" />
</p>

# Voya - Travel Tracker

A modern web application for tracking, sharing, and managing your travel experiences. Voya helps you preserve memories, plan trips, connect with friends, and visualize your travel journey around the world.

---

## What this repository contains

- `src/` — Vue components, views, stores, and API integrations
- `public/` — static assets
- `db.json` — lightweight JSON backend for local development
- `vite.config.js`, `package.json` — project configuration

---

## Quick demo

- Register and log in, customize your profile and select interests
- Add destinations, plan and track your trips
- View travel statistics with interactive charts
- Friend system and smart recommendations
- Admin panel for user management and bans

---

## Technologies Used

| Technology      | Purpose                                 |
| --------------- | --------------------------------------- |
| **Vue.js 3**    | Frontend framework with Composition API |
| **Pinia**       | Lightweight state management            |
| **Vite**        | Modern build tool & dev server          |
| **Vue Router**  | Client-side routing                     |
| **json-server** | Mock REST API for development           |
| **CSS3**        | Styling with animations & gradients     |
| **Vitest**      | Unit testing framework                  |

---

## External APIs used

- **DiceBear Avatars** — Dynamic user avatar generation: [https://www.dicebear.com/](https://www.dicebear.com/)
- **Wikipedia API** — Automatic fetching of destination images: [https://www.wikipedia.org/](https://www.wikipedia.org/)
- **REST Countries API** — Country data (name, flag, population, etc): [https://restcountries.com/](https://restcountries.com/)
- **Wikidata API** — Structured data about destinations and countries: [https://www.wikidata.org/](https://www.wikidata.org/)

---

## Project features

- User registration and authentication
- Profile customization (photo, bio, interests)
- Add, edit, and remove trips/destinations
- Travel statistics with interactive charts
- Friend system and recommendations
- Travel journal
- Admin panel (ban/unban/delete users)
- Responsive design for desktop and mobile
- Automatic destination images (Wikipedia)
- Persistent data in `db.json`

---

## Project structure


- `src/` — application source
   - `components/` — reusable UI components
   - `views/` — main pages (Login, Register, Home, Admin, etc.)
   - `stores/` — Pinia stores for global state
   - `api/` — API wrappers for local and external APIs
   - `css/` — global and page-specific styles
   - `router/` — Vue Router configuration
   - `tests/` — unit and integration tests
- `db.json` — local database (mock)
- `public/` — static assets
- `vite.config.js` — Vite configuration

---

## Getting started

### Prerequisites

- Node.js v14 or higher
- npm or pnpm

### Installation

1. Clone the repository and open the project folder:

   ```bash
   git clone https://github.com/pedrorodrigues25/pw1-travel-tracker.git
   cd pw1-travel-tracker/voya
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   ```

3. Run unit tests:

   ```bash
   npm run test:unit
   # or
   pnpm run test:unit
   ```

4. Start the application (two terminals):
   - **Terminal 1:** Start json-server
     ```bash
     npx json-server --watch db.json --port 3001
     ```
   - **Terminal 2:** Start the development server
     ```bash
     npm run dev
     # or
     pnpm run dev
     ```

5. Open `http://localhost:5173` in your browser.

---

## Main routes

| Route              | Purpose                      |
| ------------------ | ---------------------------- |
| `/`                | Landing page                 |
| `/login`           | User login                   |
| `/register`        | New user registration        |
| `/destinations`    | Dashboard/trip summary       |
| `/interests`       | Interest selection           |
| `/trips`           | List of user trips           |
| `/recommendations` | Friend recommendations       |
| `/friends`         | Friend list and management   |
| `/profile`         | User profile                 |
| `/admin`           | Admin dashboard (admin only) |

---

## Default admin account

- Email: `admin@gmail.com`
- Password: `admin123`
- Use the "Admin Login" button on the login page.

---

## Team

| Name             | GitHub                               |
| ---------------- | ------------------------------------ |
| Pedro Rodrigues  | https://github.com/pedrorodrigues25  |
| Mariana Ferreira | https://github.com/marianaferreira27 |
| Miguel Caldas    | https://github.com/Mcaldas11         |

---

## Contributing

- Open an issue or submit a pull request.
- For questions or suggestions, contact the team or use GitHub.

---

## License

This project was developed for educational purposes as part of the Web Programming 1 unit within the Web Information Systems and Technologies (TSIW) degree at ESMAD.
