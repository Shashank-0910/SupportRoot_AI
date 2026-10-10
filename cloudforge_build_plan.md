# ☁ Supportroot Ai — Build Plan

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite 8 + Tailwind CSS 4 |
| Routing | React Router v7 |
| Charts | Recharts |
| Icons | Lucide React (SVG icons, not emojis) |
| HTTP Client | Axios |
| Backend | Django 5 + Django REST Framework |
| Auth | JWT (djangorestframework-simplejwt) |
| Database | PostgreSQL (SQLite for initial dev) |
| AI Service | Mock service → later OpenAI + LangChain + RAG |

## Design System
- **Theme**: Dark (deep navy `#0a0a12` / charcoal `#12121e`)
- **Accent**: Violet-to-purple gradient (`#8b5cf6` → `#a855f7` → `#c084fc`)
- **Cards**: Semi-transparent with subtle borders (`rgba(255,255,255,0.05)`)
- **Typography**: Inter (Google Fonts)
- **Icons**: Lucide React (clean SVG icons throughout — no emojis)
- **Animations**: Subtle micro-animations, smooth transitions

## Build Order (End-to-End per Feature)

### Phase 1: Foundation & Landing Page
- [x] Project scaffolding (frontend already exists)
- [ ] Install dependencies (react-router, lucide-react, recharts, axios)
- [ ] Design system setup (Tailwind config, CSS variables, base styles)
- [ ] Landing page with all sections (Hero, Features, How it Works, Pricing, Testimonials, Footer)
- [ ] Responsive layout shell (sidebar + topbar for dashboard pages)

### Phase 2: Auth + Django Backend Setup
- [ ] Django project setup (`backend/`)
- [ ] PostgreSQL / SQLite configuration
- [ ] User + Workspace models
- [ ] JWT auth endpoints: register, login, logout, me
- [ ] React auth pages: `/login`, `/register`, `/forgot-password`
- [ ] Protected routes + auth context
- [ ] Connect frontend auth to Django API

### Phase 3: Dashboard
- [ ] Dashboard API endpoint with aggregated stats
- [ ] Dashboard page with stat cards, charts, recent conversations
- [ ] Sidebar navigation (all nav items)

### Phase 4: Knowledge Base
- [ ] Document model in Django
- [ ] Document CRUD API
- [ ] Knowledge Base page with upload UI
- [ ] File upload flow (upload → processing → processed)
- [ ] Document list with status indicators

### Phase 5: AI Assistant + Conversations
- [ ] Conversation + Message models
- [ ] Mock AI service in Django (`services/ai_service.py`)
- [ ] Chat API endpoint
- [ ] AI Assistant chat interface
- [ ] Conversations list page
- [ ] Conversation detail view
- [ ] Human handoff trigger when AI confidence is low

### Phase 6: Tickets
- [ ] Ticket model in Django
- [ ] Ticket CRUD API
- [ ] Tickets list page with priority/status badges
- [ ] Ticket detail view with AI analysis + resolution
- [ ] Create ticket from conversation escalation

### Phase 7: Analytics
- [ ] Analytics API with computed metrics
- [ ] Analytics page with KPI cards
- [ ] Charts: conversation trends, resolution rates, response times
- [ ] AI resolution progress bar

### Phase 8: Settings
- [ ] Settings page with tabbed sections
- [ ] Profile, Company, AI Assistant, Notifications, Team, Billing tabs
- [ ] Some tabs functional, others UI-only for prototype

### Phase 9: Demo Data & Polish
- [ ] Management command to seed realistic demo data
- [ ] End-to-end testing of full user flow
- [ ] Animations and micro-interactions polish
- [ ] Responsive design verification

## Database Schema

```
User ─── Workspace ─┬── Document
                    ├── Conversation ── Message
                    ├── Ticket
                    └── AnalyticsSnapshot
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user + workspace |
| POST | `/api/auth/login/` | Login, returns JWT |
| POST | `/api/auth/logout/` | Blacklist refresh token |
| GET | `/api/auth/me/` | Current user profile |
| GET | `/api/dashboard/` | Dashboard stats |
| GET | `/api/documents/` | List documents |
| POST | `/api/documents/` | Upload document |
| DELETE | `/api/documents/:id/` | Delete document |
| POST | `/api/chat/` | Send message, get AI response |
| GET | `/api/conversations/` | List conversations |
| GET | `/api/conversations/:id/` | Conversation detail |
| GET | `/api/tickets/` | List tickets |
| POST | `/api/tickets/` | Create ticket |
| PATCH | `/api/tickets/:id/` | Update ticket |
| GET | `/api/analytics/` | Analytics data |

## Service Layer Architecture

```
backend/
├── apps/
│   ├── accounts/      # User, Workspace
│   ├── documents/     # Document management
│   ├── conversations/ # Conversations, Messages
│   ├── tickets/       # Ticket management
│   └── analytics/     # Analytics
├── services/
│   ├── ai_service.py        # Mock AI → later OpenAI/RAG
│   ├── document_service.py  # Document processing
│   ├── analytics_service.py # Metrics computation
│   └── ticket_service.py    # Ticket workflows
└── core/
    └── settings.py
```

> [!IMPORTANT]
> Starting with **Phase 1: Foundation & Landing Page** now.
