# Data Model Documentation

## Overview

The portfolio uses three JSON files in the `data/` directory as its data store. There is no relational database; all relationships are expressed via ID references (`categoryId` on projects referencing `id` in categories).

---

## `data/settings.json`

A single JSON object representing all site-wide configuration. Updated atomically via `PUT /api/settings` or `PUT /api/admin/settings/skills`.

### Top-Level Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Display name of the artist |
| `title` | string | Yes | Professional title (e.g. "3D Environment Artist") |
| `tagline` | string | No | Short tagline shown in SEO/meta |
| `subtitle` | string | Yes | Hero section subtitle text (software tools) |
| `bio` | string | Yes | About section biography text |
| `heroMedia` | string | No | Path to hero background video (e.g. `public/Create_a_cinematic_photoreali.mp4`) |
| `profileImage` | string | No | Path to profile/avatar image |
| `image` | string | No | Alias/fallback for profile image |
| `resumeUrl` | string | No | URL to downloadable resume PDF |
| `seoTitle` | string | No | Custom SEO title override |
| `seoDescription` | string | No | Custom SEO meta description |
| `ogImage` | string | No | Open Graph image URL |
| `email` | string | Yes | Primary contact email |
| `location` | string | Yes | Geographic location (e.g. "Punjab, India") |
| `phone` | string | No | Contact phone number |
| `linkedin` | string | No | LinkedIn profile URL |
| `socials` | object | No | Social media links (see below) |
| `skills` | array of strings | No | General skills displayed in About and Resume sections |
| `awards` | array of objects | No | Awards and recognitions (see below) |
| `education` | array of objects | No | Education entries (see below) |
| `resume` | object | No | Resume-specific structured data (see below) |
| `tools` | array of strings | No | Software tools displayed in About section |
| `services` | array of objects | No | Services offered (see below) |
| `updatedAt` | string (ISO 8601) | Auto | Last modification timestamp |

### `socials` Object

| Field | Type | Description |
|---|---|---|
| `linkedin` | string | LinkedIn profile URL |
| `artstation` | string | ArtStation profile URL |
| `twitter` | string | Twitter/X profile URL |

### `awards` Array

Each entry:

| Field | Type | Description |
|---|---|---|
| `event` | string | Name of the award event |
| `achievement` | string | Achievement or nomination description |

Example:

```json
[
  { "event": "24 Frames 2023", "achievement": "Matte Painting - Nomination" }
]
```

### `education` Array

Each entry:

| Field | Type | Description |
|---|---|---|
| `institution` | string | School or institution name |
| `degree` | string | Degree or certification name |
| `focus` | string | Area of focus |
| `specialization` | string | Specific specialization note |

Example:

```json
[
  {
    "institution": "MAAC",
    "degree": "Professional Training",
    "focus": "3D Generalist Focus",
    "specialization": "Maya Specialist - Primary Expertise"
  }
]
```

### `resume` Object

| Field | Type | Description |
|---|---|---|
| `name` | string | Name displayed in resume header |
| `title` | string | Job title displayed in resume header |
| `email` | string | Email displayed in resume contact row |
| `location` | string | Location displayed in resume contact row |
| `summary` | string | Professional summary paragraph |
| `experience` | array of objects | Work history entries (see below) |
| `skills` | array of strings | Skills displayed in resume section |
| `software` | array of strings | Software/tools listed in resume |

### `resume.experience` Array

Each entry:

| Field | Type | Description |
|---|---|---|
| `role` | string | Job title |
| `company` | string | Company or organization name |
| `period` | string | Employment period (e.g. "Nov 2024 - Present") |
| `description` | string | Role description and responsibilities |

### `services` Array

Each entry:

| Field | Type | Description |
|---|---|---|
| `id` | string | URL-safe slug identifier |
| `title` | string | Service name |
| `description` | string | Service description |

Example:

```json
[
  { "id": "3d-modeling", "title": "3D Modeling", "description": "High-poly and low-poly assets for games and film" }
]
```

---

## `data/projects.json`

An array of project objects. Projects are the primary content entity.

### Project Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique internal identifier |
| `title` | string | Yes | Display title |
| `slug` | string | Yes | URL-safe slug; must be unique across all projects |
| `categoryId` | string | Yes | Reference to `categories.json` `id` field |
| `year` | string | No | Year of project completion |
| `role` | string | Yes | Role played in the project |
| `description` | string | Yes | Full project description |
| `featured` | boolean | No | Whether the project is featured (default: `false`) |
| `published` | boolean | No | Whether the project is publicly visible (default: `false`) |
| `sortOrder` | integer | No | Display sort priority; lower = earlier (default: `0`) |
| `software` | array of strings | No | Software tools used |
| `coverImage` | string | Yes | Path to cover/thumbnail image (relative to project root) |
| `heroImage` | string | Yes | Path to hero/large image |
| `gallery` | array | No | Additional gallery image paths (currently unused) |
| `video` | string | No | Path to project video file |
| `optimization` | string | No | Optimization notes |
| `credits` | array | No | Team credits (currently unused) |
| `createdAt` | string (ISO 8601) | Auto | Creation timestamp |
| `updatedAt` | string (ISO 8601) | Auto | Last modification timestamp |

### Example Project

```json
{
  "id": "high-end-car",
  "title": "High-End Car Render",
  "slug": "high-end-car-render",
  "categoryId": "product-viz",
  "year": "2024",
  "role": "3D Artist",
  "description": "Photorealistic automotive visualization...",
  "featured": true,
  "published": true,
  "sortOrder": 1,
  "software": ["Maya", "Arnold"],
  "coverImage": "assets/projects/car-render/cover.svg",
  "heroImage": "assets/projects/car-render/hero.svg",
  "gallery": [],
  "video": "",
  "optimization": "",
  "credits": [],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

## `data/categories.json`

An array of category objects used to group projects.

### Category Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | Yes | Unique identifier used as `categoryId` in projects |
| `name` | string | Yes | Human-readable category name |
| `slug` | string | Yes | URL-safe slug for the category |

### Example Categories

```json
[
  { "id": "product-viz", "name": "Product Visualization", "slug": "product-visualization" },
  { "id": "prop-art",    "name": "Prop Art",             "slug": "prop-art" },
  { "id": "character-art", "name": "Character Art",       "slug": "character-art" },
  { "id": "animation",   "name": "Animation",             "slug": "animation" }
]
```

---

## Relationships Between Entities

```
settings.json (1) ----provides defaults for----> (N) rendered sections
projects.json (N) ----belongs to----> categories.json (1)   [via categoryId -> id]
projects.json (N) ----has assets in----> assets/projects/<slug>/  [cover.svg, hero.svg, video]
```

- **Projects -> Categories**: Each project has a `categoryId` that maps to a category `id` in `categories.json`.
- **Projects -> Assets**: Each project's `coverImage`, `heroImage`, and `video` paths reference files under `assets/projects/<project-slug>/`.
- **Settings -> Everything**: The `settings.json` object contains or references all non-project content (bio, skills, resume, services, contact, education, awards).

---

## Admin CRUD Operations on Each Entity

### Projects

| Operation | Endpoint | Notes |
|---|---|---|
| Create | `POST /api/admin/projects` | Requires `title` and `slug`. Auto-sets `published`, `featured`, `sortOrder`, `createdAt`, `updatedAt`. Rejects duplicate slugs. |
| Read | `GET /api/admin/projects` | Returns all projects including drafts. |
| Update | `PUT /api/admin/projects/<slug>` | Partial update; `updatedAt` refreshed automatically. |
| Delete | `DELETE /api/admin/projects/<slug>` | Removes project by slug. |

### Skills

Skills are stored as a flat array of strings inside `settings.json` under the `skills` key.

| Operation | Endpoint | Notes |
|---|---|---|
| Read | `GET /api/admin/settings/skills` | Returns the skills array. |
| Update | `PUT /api/admin/settings/skills` | Replaces entire skills array. Admin UI adds/removes individual items by reading, mutating, and re-submitting the full array. |

### Experience

Experience entries are stored inside `settings.json` under `resume.experience` as an array of objects.

| Operation | Endpoint | Notes |
|---|---|---|
| Read | `GET /api/admin/settings/experience` | Returns the `resume.experience` array. |
| Create | `POST /api/admin/settings/experience` | Requires `role` and `company`. Appends to array. |
| Update | `PUT /api/admin/settings/experience/<index>` | Replaces entry at given array index. |
| Delete | `DELETE /api/admin/settings/experience/<index>` | Removes entry at given array index. |

### Settings (Full Object)

| Operation | Endpoint | Notes |
|---|---|---|
| Read | `GET /api/settings` | Returns complete settings object. |
| Update | `PUT /api/settings` | Merges provided fields into existing settings object and sets `updatedAt`. No authentication required in current implementation. |
