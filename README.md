# VoiceBite 🎙️🤖

**VoiceBite** is an AI-powered voice ordering experience that lets users browse menus, search items, add to cart, and place orders — entirely by speaking naturally.

Instead of tapping through complex app interfaces, users simply talk:

> *"What deals do you have today?"*  
> *"I want something light"*  
> *"Add this to my cart"*  
> *"Place my order"*

The app understands intent, handles vague requests, suggests alternatives if something isn't available, and guides the user all the way to checkout — like a digital waiter.

---

## How It Works

1. **Voice Input** — The browser's Web Speech API captures the user's speech and converts it to text.
2. **AI Intent Engine** — The transcript is sent to a backend endpoint that uses Google Gemini AI to parse the user's intent against the current menu context.
3. **Action Execution** — The AI returns a structured JSON action (e.g., search, navigate to category, add to cart, process payment), and the frontend executes it.
4. **Feedback** — The user receives visual and toast notifications for every action — item added, order placed, suggestions offered, etc.

The AI understands **8 intent types** and maps speech to structured JSON actions:

| Intent | Example | Action |
|--------|---------|--------|
| Browse category | "Show me pizzas" | Navigate to category page |
| Search | "I want something light" | Smart search across name, description & category |
| View deals | "What offers do you have?" | Filter discounted items |
| Add to cart | "Add pepperoni pizza" | Find by name match, increment quantity |
| Checkout | "Place my order" | Process payment, clear cart |
| List categories | "What do you have?" | Show all available categories |
| Navigate | "Go to cart" | Route to any page |
| Guidance | "Help me order" | Show contextual assistant message |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18, Vite, React Router |
| UI & Icons | Lucide React, React Hot Toast, Glass-morphism CSS |
| HTTP Client | Axios |
| Backend Runtime | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| AI Engine | Google Gemini (`gemini-3-flash-preview`) |
| Voice API | Web Speech API (`webkitSpeechRecognition`) |
| Deployment | Vercel (frontend static + backend serverless) |
| Environment | dotenv, CORS |

---

## Project Structure

```
voicebite/
├── frontend/                # React SPA (Vite)
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── VoiceControl/  # Mic button with pulse animation
│   │   │   ├── Navigation/    # Sidebar with category links
│   │   │   ├── Menu/          # Product cards grid
│   │   │   ├── Cart/          # Sticky cart & full cart page
│   │   │   └── Admin/         # Add & manage products
│   │   ├── hooks/           # useSpeechRecognition hook
│   │   ├── lib/             # API client, cart context, mock data
│   │   └── styles/          # Global CSS variables & theming
│   └── index.html
│
├── backend/                 # Express API
│   ├── api/index.js         # Serverless entry point (Vercel)
│   ├── controllers/         # Menu CRUD + AI processing
│   ├── routes/              # /api/menu, /api/ai
│   ├── models/              # Mongoose MenuItem schema
│   ├── config/db.js         # MongoDB connection with DNS fallback
│   ├── seed.js              # Database seed script
│   └── research/            # Intent engine experiments (Jupyter)
│
├── .gitignore
└── README.md
```

---

## Local Development

### Backend

```bash
cd backend
npm install
cp .env.example .env    # add your MONGODB_URI and GEMINI_API_KEY
npm run seed            # populate database with sample menu items
npm run dev             # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev             # starts on http://localhost:5173
```

Set `VITE_API_BASE_URL` in the frontend `.env.local` to point to your local or deployed backend.

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/menu` | Fetch all menu items |
| GET | `/api/menu/category/:category` | Filter items by category |
| POST | `/api/menu` | Create a new menu item |
| DELETE | `/api/menu/:id` | Delete a menu item |
| POST | `/api/ai/process-command` | Send voice transcript for AI intent parsing |

---

## Deployment

Both frontend and backend are configured for **Vercel** deployment:

- **Frontend**: Static SPA build via Vite, with SPA fallback rewrites in `vercel.json`
- **Backend**: Serverless Node.js functions via `@vercel/node`, with `api/index.js` as the entry point

---

## Notable Details

- **Local search fallback** — When the AI returns a `SEARCH` action, the frontend fetches all menu items and filters client-side by matching search terms against item name, description, and category. This handles vague queries like "something light" or "I want a drink".
- **Menu seed data** — The `seed.js` script populates MongoDB with sample items across 6 categories: pizza, pasta, traditionals, desserts, beverages, and deals (with optional discounts for flash deal demos).
- **Mock data** — The frontend ships with static mock data (`mockData.js`) for development when the backend is unavailable.
- **Connection resilience** — The backend's MongoDB connector includes automatic DNS fallback for SRV lookup failures, making it robust in serverless environments.

---

## Design

- **Dark theme** with gold (#ffd700) accents and glass-morphism cards
- **Toast notifications** for all user interactions (cart updates, AI responses, errors)
- **Admin panel** for adding and managing menu items directly from the UI
