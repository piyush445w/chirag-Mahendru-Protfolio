# Chirag Mahendru - 3D Environment Artist Portfolio

A modern, cinematic single-page portfolio for 3D Environment Artist **Chirag Mahendru**. The site combines a Flask backend with a vanilla HTML, CSS, and JavaScript frontend, and includes a server-rendered admin dashboard for managing portfolio content without a database or build step.

## Overview

This project is a responsive portfolio website designed to showcase Chirag Mahendru's 3D art, environment work, product visualization, prop art, character art, and animation projects. Content is loaded dynamically from JSON-backed Flask APIs and rendered by the browser.

The application includes:

- A full-screen cinematic hero video and animated introduction.
- A responsive single-page experience with About, Work, Resume, Services, and Contact sections.
- A data-driven project grid with category filtering and project detail views.
- A password-protected admin dashboard for managing projects, categories, site settings, skills, experience, SEO content, and uploaded media.
- Atomic JSON file persistence, making the project simple to run locally or deploy as a small single-instance website.

There is no relational database, frontend framework, package bundler, or transpilation step.

## Features

### Visitor Experience

- Full-screen autoplaying, muted, looping hero video with cinematic overlays.
- Animated hero entrance, scroll indicator, and clear calls to action.
- Sticky navigation with smooth scrolling and active-section highlighting.
- Responsive mobile navigation with an animated full-screen menu.
- About section with biography, tools, skills, process steps, education, and location.
- Selected Work section with a responsive project grid.
- Project category filters generated from `data/categories.json`.
- Featured and published project sorting.
- Project cards with hover effects, software tags, and category badges.
- Hash-based project detail routing with a modal-style detail view.
- Project galleries and project video playback when media is configured.
- Resume section with summary, experience, skills, awards, and software.
- Services grid for modeling, visualization, game assets, environments, texturing, and rendering.
- Contact section with email, phone, LinkedIn, social links, and a client-side demo form.
- Custom cursor, canvas particle animation, parallax effects, and scroll progress indicator.
- Scroll-triggered animations and staggered content entrances.
- Loading screen, ambient glow effects, and glass-style card surfaces.
- Responsive layouts for desktop, tablet, and mobile devices.
- Semantic HTML, skip navigation, ARIA labels, image alt text, and visible focus styling.

### Admin and Content Management

- Password-protected admin session with a login page at `/admin/login`.
- Login attempt rate limiting.
- CSRF protection for administrative mutations.
- Dashboard statistics for projects, categories, media, hero media, and skills.
- Project create, read, update, and delete operations.
- Project metadata, software tags, gallery URLs, video URLs, featured state, published state, and sort order management.
- Category create, read, update, and delete operations.
- Site-wide settings management for identity, biography, contact details, tools, services, education, awards, and SEO fields.
- Skills list management.
- Resume experience entry management.
- Media browser and upload workflow.
- Hero image upload and removal.
- Dedicated SEO editing workflow.
- Server-rendered admin pages with responsive sidebar navigation.
- Atomic JSON writes using a temporary file and replacement pattern.

## Tech Stack

| Area | Technology |
| --- | --- |
| Backend | Python, Flask |
| CORS | Flask-CORS |
| Frontend markup | HTML5 |
| Frontend styling | CSS3, CSS Custom Properties |
| Frontend behavior | Vanilla JavaScript |
| Data storage | JSON files |
| Admin rendering | Flask sessions and inline Jinja templates |
| Static delivery | Flask `send_from_directory` |
| Build process | None required |
| Database | None |

## Quick Start

### Requirements

- Python 3.9 or newer is recommended.
- A modern web browser.
- A terminal or PowerShell window.

### 1. Open the Project

```powershell
cd "C:\Users\mahen\OneDrive\Desktop\Chirag Protfolio"
```

### 2. Create a Virtual Environment

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If script execution is disabled in PowerShell, use:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

### 3. Install Dependencies

```powershell
pip install -r requirements.txt
```

The requirements file installs:

- `Flask>=3.0.0`
- `flask-cors>=4.0.0`

### 4. Configure the Application

Set the environment variables before starting the server:

```powershell
$env:ADMIN_PASSWORD = "replace-with-a-strong-password"
$env:FLASK_SECRET_KEY = "replace-with-a-long-random-secret"
$env:PORT = "5000"
$env:DEBUG = "1"
```

For a production deployment, set `DEBUG` to `0`, use a strong admin password, and use a unique secret key.

Cross-platform example:

```bash
ADMIN_PASSWORD="replace-with-a-strong-password" \
FLASK_SECRET_KEY="replace-with-a-long-random-secret" \
PORT=5000 \
DEBUG=1 \
python app.py
```

### 5. Run the Server

```powershell
python app.py
```

### 6. Open the Portfolio

Open the following address in a browser:

```text
http://localhost:5000
```

The application listens on `0.0.0.0` and uses port `5000` by default.

## Project Structure

```text
Chirag Protfolio/
â”œâ”€â”€ app.py
â”œâ”€â”€ app.js
â”œâ”€â”€ index.html
â”œâ”€â”€ styles.css
â”œâ”€â”€ requirements.txt
â”œâ”€â”€ README.md
â”œâ”€â”€ .gitignore
â”œâ”€â”€ ARCHITECTURE.md
â”œâ”€â”€ DATA_MODEL.md
â”œâ”€â”€ INSTRUCTIONS.md
â”œâ”€â”€ MILESTONES.md
â”œâ”€â”€ UI_SPEC.md
â”œâ”€â”€ data/
â”‚   â”œâ”€â”€ settings.json
â”‚   â”œâ”€â”€ projects.json
â”‚   â”œâ”€â”€ categories.json
â”‚   â””â”€â”€ media.json
â”œâ”€â”€ public/
â”‚   â””â”€â”€ Create_a_cinematic_photoreali.mp4
â”œâ”€â”€ assets/
â”‚   â””â”€â”€ projects/
â”‚       â”œâ”€â”€ ancient-axe/
â”‚       â”‚   â”œâ”€â”€ cover.svg
â”‚       â”‚   â””â”€â”€ hero.svg
â”‚       â”œâ”€â”€ car-render/
â”‚       â”‚   â”œâ”€â”€ cover.svg
â”‚       â”‚   â””â”€â”€ hero.svg
â”‚       â”œâ”€â”€ chess/
â”‚       â”‚   â”œâ”€â”€ cover.svg
â”‚       â”‚   â””â”€â”€ hero.svg
â”‚       â”œâ”€â”€ heels/
â”‚       â”‚   â”œâ”€â”€ cover.svg
â”‚       â”‚   â””â”€â”€ hero.svg
â”‚       â”œâ”€â”€ reel/
â”‚       â”‚   â”œâ”€â”€ cover.svg
â”‚       â”‚   â”œâ”€â”€ hero.svg
â”‚       â”‚   â””â”€â”€ showreel.mp4
â”‚       â””â”€â”€ robot/
â”‚           â”œâ”€â”€ cover.svg
â”‚           â””â”€â”€ hero.svg
â”œâ”€â”€ images/
â”‚   â””â”€â”€ project-placeholder.svg
â””â”€â”€ uploads/
    â”œâ”€â”€ hero/
    â””â”€â”€ projects/
```

### Main Files

| Path | Purpose |
| --- | --- |
| `app.py` | Flask server, routes, authentication, APIs, admin pages, uploads, and JSON persistence |
| `index.html` | Single-page portfolio shell and semantic page sections |
| `styles.css` | Public visual design, responsive rules, animations, and CSS custom properties |
| `app.js` | API loading, dynamic rendering, navigation, filters, modal routing, and interactive effects |
| `requirements.txt` | Python package dependencies |
| `data/settings.json` | Site identity, bio, contact, tools, services, resume, awards, education, and SEO settings |
| `data/projects.json` | Published and draft project records |
| `data/categories.json` | Project category definitions |
| `data/media.json` | Uploaded media metadata |
| `public/` | Public media such as the hero background video |
| `assets/projects/` | Project cover, hero, and showreel assets |
| `uploads/` | Runtime uploads created through the admin dashboard |

## Admin Panel

### Access

1. Start the Flask server.
2. Open `http://localhost:5000/admin/login`.
3. Enter the password configured in the `ADMIN_PASSWORD` environment variable.
4. After authentication, the dashboard is available at `http://localhost:5000/admin`.

The current development implementation falls back to `admin123` when `ADMIN_PASSWORD` is not set. Set a strong value before exposing the site publicly.

### Admin Pages

| URL | Purpose |
| --- | --- |
| `/admin/login` | Administrator login |
| `/admin` | Dashboard and quick actions |
| `/admin/projects` | Create, edit, publish, feature, and delete projects |
| `/admin/categories` | Manage project categories |
| `/admin/settings` | Manage site-wide content and settings |
| `/admin/media` | Browse uploaded media and upload files |
| `/admin/seo` | Manage SEO title, description, Open Graph image, and robots settings |
| `/admin/skills` | Manage the skills list |
| `/admin/experience` | Manage resume experience entries |
| `/admin/logout` | End the administrator session |

Administrative API mutations require an authenticated session and a valid CSRF token. The admin forms inject the token automatically.

## API Endpoints

All API responses are JSON. Public read endpoints do not require authentication. Admin endpoints require a successful login; mutation endpoints also require CSRF validation.

### Public API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/settings` | Returns the complete site settings object |
| `PUT` | `/api/settings` | Merges and saves settings fields |
| `GET` | `/api/projects` | Returns published projects sorted by featured status, sort order, and update time |
| `GET` | `/api/projects/<slug>` | Returns one published project by slug |
| `GET` | `/api/categories` | Returns all project categories |

> **Deployment note:** In the current implementation, `PUT /api/settings` is publicly accessible. Remove or protect this route before public deployment if settings changes should be restricted to administrators.

### Admin API: Projects

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/admin/projects` | Returns all projects, including drafts |
| `POST` | `/api/admin/projects` | Creates a project |
| `PUT` | `/api/admin/projects/<slug>` | Updates an existing project |
| `DELETE` | `/api/admin/projects/<slug>` | Deletes a project |

### Admin API: Categories

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/admin/categories` | Returns all categories |
| `POST` | `/api/admin/categories` | Creates a category |
| `PUT` | `/api/admin/categories/<id>` | Updates an existing category |
| `DELETE` | `/api/admin/categories/<id>` | Deletes a category |

### Admin API: Settings, Skills, and Experience

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/admin/settings/editable` | Returns the complete editable settings object |
| `PUT` | `/api/admin/settings` | Merges and saves site settings |
| `GET` | `/api/admin/settings/skills` | Returns the skills array |
| `PUT` | `/api/admin/settings/skills` | Replaces the complete skills array |
| `GET` | `/api/admin/settings/experience` | Returns resume experience entries |
| `POST` | `/api/admin/settings/experience` | Adds a resume experience entry |
| `PUT` | `/api/admin/settings/experience/<index>` | Replaces an experience entry by array index |
| `DELETE` | `/api/admin/settings/experience/<index>` | Deletes an experience entry by array index |

### Admin API: Media, Uploads, and SEO

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/admin/media` | Returns uploaded media metadata |
| `DELETE` | `/api/admin/media/<id>` | Removes a media metadata record |
| `POST` | `/admin/upload` | Uploads a file to a selected upload folder |
| `POST` | `/api/admin/hero-image` | Uploads an image and sets it as the hero image |
| `POST` | `/api/admin/hero-image/clear` | Clears the configured hero image |
| `PUT` | `/admin/seo` | Updates SEO-related settings |

### Static and Page Routes

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/` | Serves the portfolio single-page application |
| `GET` | `/<path:filename>` | Serves root-level static files |
| `GET` | `/uploads/<path:filename>` | Serves uploaded media |
| `GET` | `/admin/static/<path:filename>` | Serves static files referenced by admin templates |

## Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `ADMIN_PASSWORD` | `admin123` in development | Password used to authenticate the admin dashboard |
| `FLASK_SECRET_KEY` | Development fallback | Secret used to sign Flask sessions; use a long random value in production |
| `PORT` | `5000` | TCP port used by the Flask development server |
| `DEBUG` | `1` | `1` enables Flask debug mode; `0` disables it |

Example PowerShell configuration:

```powershell
$env:ADMIN_PASSWORD = "strong-admin-password"
$env:FLASK_SECRET_KEY = "long-random-session-secret"
$env:PORT = "5000"
$env:DEBUG = "0"
```

## Data Storage

The application uses four JSON files under `data/` instead of a database:

| File | Contents |
| --- | --- |
| `data/settings.json` | Site-wide identity, biography, contact information, tools, services, resume, awards, education, and SEO data |
| `data/projects.json` | Project metadata, media references, publication state, and display ordering |
| `data/categories.json` | Category IDs, names, and slugs used by project filters |
| `data/media.json` | Metadata for files uploaded through the admin dashboard |

Writes are saved through a temporary `.tmp` file and then atomically replaced. This keeps the deployment lightweight, but JSON file storage is best suited to a single-instance site with modest content volume. Back up the `data/` directory before making large content changes or deploying updates.

## Customization

- Update site identity, biography, contact details, tools, services, awards, education, resume, and SEO data in `data/settings.json` or through the admin dashboard.
- Add or edit projects through `/admin/projects` or `data/projects.json`.
- Add or edit categories through `/admin/categories` or `data/categories.json`.
- Place project media under `assets/projects/<project-slug>/` and reference the paths in the project record.
- Replace the hero video in `public/` and update `settings.heroMedia`.
- Upload additional media through the admin media page; uploaded files are stored under `uploads/`.
- Keep JSON valid and use relative paths for local assets.

The contact form is currently a client-side demonstration and displays a confirmation message without sending an email. Connect it to an email service or backend endpoint before using it in production.

## Production Notes

- Set `DEBUG=0`.
- Replace both the admin password and Flask secret key with strong, unique values.
- Restrict CORS origins if the API should not be publicly accessible from any origin.
- Protect or remove the public settings-write endpoint.
- Use a production WSGI server such as Gunicorn when deploying beyond local development.
- Keep regular backups of the `data/` directory and uploaded media.
- Use a database or object storage if multiple application instances or high-volume media management are required.

## License

This project is licensed under the MIT License.

```text
MIT License

Copyright (c) 2026 Chirag Mahendru

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
