# Architecture Documentation

## Overview

The Chirah Portfolio is a Flask-based single-page portfolio application for 3D Environment Artist Chirag Mahendru. It uses vanilla HTML/CSS/JS on the frontend with a JSON-file-backed Flask backend, plus a server-side rendered admin dashboard.

---

## Flask Backend Structure

### Entry Point: `app.py`

The application is a single Flask module (`app.py`, ~2080 lines) that serves all concerns:

| Concern | Implementation |
|---|---|
| Static file serving | Custom `/<path>` route using `send_from_directory` |
| Public API | `/api/settings`, `/api/projects`, `/api/projects/<slug>`, `/api/categories` |
| Admin API | `/api/admin/projects`, `/api/admin/settings/skills`, `/api/admin/settings/experience` |
| Admin pages | Server-rendered HTML templates embedded as Python string constants |
| Session auth | Flask `session` with `login_required` decorator |
| Data I/O | `load_json()` / `save_json()` helpers reading `data/*.json` |

### Key Constants and Paths

```python
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(ROOT_DIR, "data")
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
```

### Route Summary

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/` | GET | None | Serves `index.html` |
| `/<path:filename>` | GET | None | Serves static assets (CSS, JS, images, video) |
| `/api/settings` | GET | None | Returns full settings JSON |
| `/api/settings` | PUT | None | Updates settings (no auth in current implementation) |
| `/api/projects` | GET | None | Returns published projects sorted by featured/order/date |
| `/api/projects/<slug>` | GET | None | Returns single published project |
| `/api/categories` | GET | None | Returns all categories |
| `/admin/login` | GET/POST | None | Login form + password verification |
| `/admin/logout` | GET | Required | Clears session |
| `/admin` | GET | Required | Dashboard overview |
| `/admin/projects` | GET | Required | Project management page |
| `/admin/skills` | GET | Required | Skill management page |
| `/admin/experience` | GET | Required | Experience management page |
| `/api/admin/projects` | GET | Required | List all projects |
| `/api/admin/projects` | POST | Required | Create project |
| `/api/admin/projects/<slug>` | PUT | Required | Update project |
| `/api/admin/projects/<slug>` | DELETE | Required | Delete project |
| `/api/admin/settings/skills` | GET | Required | List skills |
| `/api/admin/settings/skills` | PUT | Required | Replace skills array |
| `/api/admin/settings/experience` | GET | Required | List experience entries |
| `/api/admin/settings/experience` | POST | Required | Add experience entry |
| `/api/admin/settings/experience/<int:index>` | PUT | Required | Update experience entry |
| `/api/admin/settings/experience/<int:index>` | DELETE | Required | Delete experience entry |
| `/admin/static/<path:filename>` | GET | None | Serves static files for admin pages |

---

## Frontend Architecture

### No Build Step / No Framework

The frontend is pure vanilla HTML/CSS/JS with no transpiler, bundler, or client-side framework.

| File | Role |
|---|---|
| `index.html` | Single-page application shell with six semantic `<section>` elements |
| `styles.css` (~1506 lines) | All public-facing styles with CSS custom properties |
| `app.js` (~846 lines) | Vanilla JS app: data loading, rendering, animations, routing |

### Initialization Flow (`app.js`)

```
DOMContentLoaded -> init()
  -> getElements()         # Cache DOM references
  -> setupEventListeners() # Scroll, resize, click, mousemove
  -> setupIntersectionObserver() # Scroll-triggered animations
  -> loadData()            # Fetch /api/settings + /api/projects
  -> renderDynamicContent() # Populate all sections
  -> initRouter()          # Hash-based routing
  -> initCursor()          # Custom cursor
  -> initParticles()       # Canvas particle system
  -> initScrollProgress()  # Reading progress bar
  -> initHeroAnimation()   # Hero entrance animation
  -> initMobileMenu()      # Mobile hamburger menu
```

### Rendering Model

The frontend is data-driven. All dynamic content (hero subtitle, about section, projects grid, resume, services, contact, awards) is rendered by JavaScript functions that read from in-memory `settings` and `projects` objects and inject HTML strings into placeholder elements. There is no client-side templating library; all DOM construction uses string concatenation with `innerHTML` and `textContent`.

### Hash Routing

Simple hash-based routing (`window.location.hash`) handles project detail views. The `handleRouteChange()` function fires on `hashchange` events and calls `showProjectDetail(projectId)`.

---

## Data Persistence

### Storage: JSON Files in `data/`

All data is stored as flat JSON files on disk. There is no database.

| File | Type | Purpose |
|---|---|---|
| `data/settings.json` | Object | Site-wide configuration, bio, skills, resume, services, contact |
| `data/projects.json` | Array | Portfolio projects with metadata |
| `data/categories.json` | Array | Project category definitions |

### I/O Helpers

```python
def load_json(filename, default):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        with open(path, "w", encoding="utf-8-sig") as f:
            json.dump(default, f, indent=2)
        return default
    with open(path, "r", encoding="utf-8-sig") as f:
        return json.load(f)

def save_json(filename, data):
    path = os.path.join(DATA_DIR, filename)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8-sig") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    os.replace(tmp, path)  # Atomic write
```

Writes use a temp-file + `os.replace()` pattern for crash safety. Reads use UTF-8-sig encoding to handle BOM.

---

## Admin System

### Authentication

- Password-based with SHA-256 hashing (no bcrypt/scrypt).
- Default password from `ADMIN_PASSWORD` env var, falling back to `admin123`.
- Session-based: `session['logged_in']` boolean flag; `session.permanent = True`.
- Rate limiting: max 5 login attempts per IP per 60 seconds (`_login_attempts` dict).
- CSRF token generated per session via `generate_csrf_token()` and injected into all admin forms via Jinja `{{ csrf_token() }}`.

### Admin Pages (Server-Rendered Templates)

All admin pages are embedded as Python string constants (`LOGIN_TEMPLATE`, `ADMIN_TEMPLATE`, `PROJECTS_TEMPLATE`, `SKILLS_TEMPLATE`, `EXPERIENCE_TEMPLATE`) rendered with `render_template_string`. They share a consistent sidebar layout:

- Fixed 260px left sidebar with navigation links
- Main content area with sticky header
- Admin stats showing project/category counts
- CRUD forms with table-backed list views
- Mobile-responsive: sidebar collapses to overlay below 768px

### CRUD Operations

| Entity | Create | Read | Update | Delete |
|---|---|---|---|---|
| Projects | POST `/api/admin/projects` | GET `/api/admin/projects` | PUT `/api/admin/projects/<slug>` | DELETE `/api/admin/projects/<slug>` |
| Skills | (add via list PUT) | GET `/api/admin/settings/skills` | PUT `/api/admin/settings/skills` (replace array) | (remove via list PUT) |
| Experience | POST `/api/admin/settings/experience` | GET `/api/admin/settings/experience` | PUT `/api/admin/settings/experience/<index>` | DELETE `/api/admin/settings/experience/<index>` |
| Settings | (PUT full object) | GET `/api/settings` | PUT `/api/settings` | N/A |

---

## API Design

All public APIs return JSON. Admin APIs require a logged-in session.

### Public API

```
GET  /api/settings          -> { settings object }
PUT  /api/settings          -> { updated settings }
GET  /api/projects          -> [ published projects, sorted ]
GET  /api/projects/<slug>   -> { project }
GET  /api/categories        -> [ categories ]
```

### Admin API

```
GET    /api/admin/projects              -> [ all projects ]
POST   /api/admin/projects              -> { created project }
PUT    /api/admin/projects/<slug>       -> { updated project }
DELETE /api/admin/projects/<slug>       -> { success: true }

GET    /api/admin/settings/skills       -> [ skills ]
PUT    /api/admin/settings/skills       -> [ updated skills ]

GET    /api/admin/settings/experience   -> [ experience entries ]
POST   /api/admin/settings/experience   -> { created entry }
PUT    /api/admin/settings/experience/<index> -> { updated entry }
DELETE /api/admin/settings/experience/<index> -> { success: true }
```

### Error Responses

Admin mutation endpoints return 400 for validation failures and 404 for missing resources.

---

## Static Asset Serving

The `static_files` route at `/<path:filename>` handles all non-API requests:

```python
@app.route("/<path:filename>")
def static_files(filename):
    root_path = os.path.join(ROOT_DIR, filename)
    if os.path.isfile(root_path):
        return send_from_directory(ROOT_DIR, filename)
    public_path = os.path.join(PUBLIC_DIR, filename)
    if os.path.isfile(public_path):
        return send_from_directory(PUBLIC_DIR, filename)
    abort(404)
```

This serves:
- `index.html` (SPA shell)
- `styles.css`, `app.js` (frontend assets)
- `images/` (project placeholders, profile)
- `assets/projects/<slug>/` (hero SVG, cover SVG, video)
- `public/` (hero background video: `Create_a_cinematic_photoreali.mp4`)

The admin area has a dedicated `/admin/static/<path:filename>` route for serving static files referenced within admin templates.
