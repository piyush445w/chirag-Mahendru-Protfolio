# Chirag Mahendru - 3D Environment Artist Portfolio

## Project Structure

```
Chirah Protfolio/
├── app.py              # Flask backend server
├── app.js              # Frontend JavaScript (dynamic content loading)
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── INSTRUCTIONS.md     # This file
├── public/             # Static files served by Flask
│   └── Create_a_cinematic_photoreali.mp4
└── data/               # JSON configuration files
    ├── settings.json   # Site settings (name, bio, socials, etc.)
    ├── projects.json    # Project entries
    └── categories.json # Project categories
```

---

## How to Run

### 1. Install Dependencies

```bash
pip install flask flask-cors
```

### 2. Start the Server

```bash
python app.py
```

### 3. Open in Browser

```
http://localhost:5000
```

---

## Features Documentation

### 1. Hero Section
- **Full-screen cinematic video background** - Auto-plays on load with autoplay muted loop playsinline attributes
- **Animated text reveal on load** - CSS animations reveal title, subtitle, and CTAs sequentially
- **Scroll indicator** - Animated downward arrow with Scroll text
- **Badge showing role** - 3D Environment Artist badge above the main title

### 2. Navigation
- **Sticky navbar with blur effect** - Navbar becomes translucent with backdrop-blur on scroll
- **Smooth scroll to sections** - Anchor links use native smooth scrolling
- **Mobile hamburger menu** - Toggle button with hamburger/close icons
- **Active link highlighting** - Nav links highlight based on scroll position via Intersection Observer

### 3. Projects Section
- **Grid layout** - CSS Grid with responsive columns
- **Hover effects** - Image zoom (scale 1.05), overlay reveal with title on hover
- **Category-based filtering** - Filter buttons generated from categories.json
- **Click to view project details** - Opens detail modal with gallery, video, and breakdowns
- **Featured badge** - Projects with featured: true appear first with a badge

### 4. Process Section
- **4-step workflow display** - Concept, Blockout, Production, Final Polish
- **Numbered steps with icons** - SVG icons for each phase
- **Staggered scroll animations** - Steps animate in sequentially when scrolled into view

### 5. Skills Section
- **Animated skill tags** - Tags animate in with stagger delay
- **Hover glow effects** - Tag glow on hover
- **Awards/Recognition display** - Awards loaded from settings.json with event and achievement

### 6. About Section
- **Bio text display** - Loaded from settings.json bio field
- **Tools/software list** - Rendered as tags from settings.json tools array
- **Profile image with hover effects** - Image scales and shows overlay on hover
- **Stats display** - Name and label shown in overlay

### 7. Contact Section
- **Contact form** - Name, email, message fields with validation
- **Email link display** - Email from settings.json socials array
- **Social media links** - Links from settings.json socials array

### 8. Global Features
- **Custom cursor follower** - cursor-follower div follows mouse with delay
- **Canvas particle animation** - Particle system on canvas background
- **Scroll progress bar** - Top bar showing scroll percentage
- **Parallax scrolling effects** - Elements move at different rates on scroll
- **Loading screen with spinner** - Full-screen loader with dual-ring spinner
- **Ambient glow effects** - Colored gradient orbs (blue, purple, cyan)
- **Glass morphism design** - Frosted glass effect on cards and modals

---

## API Endpoints

### GET /api/settings
Returns site settings object.

### PUT /api/settings
Update site settings. Accepts partial JSON object.

### GET /api/projects
Returns array of published projects sorted by featured status, then sortOrder.

### GET /api/projects/<slug>
Returns single project by slug or 404 if not found.

### GET /api/categories
Returns array of category objects.

---

## Customization Guide

### How to Edit settings.json

Edit data/settings.json to update site information:

```json
{
  "name": "Your Name",
  "title": "Your Title",
  "subtitle": "Tagline or specialties",
  "bio": "Your bio text here...",
  "heroMedia": "assets/hero-video.mp4",
  "profileImage": "assets/profile.png",
  "resumeUrl": "https://link-to-resume.com",
  "seoTitle": "Page Title for SEO",
  "seoDescription": "Meta description for SEO",
  "ogImage": "assets/og-image.png",
  "socials": [
    { "platform": "email", "url": "mailto:your@email.com" },
    { "platform": "twitter", "url": "https://twitter.com/..." },
    { "platform": "linkedin", "url": "https://linkedin.com/in/..." },
    { "platform": "artstation", "url": "https://artstation.com/..." }
  ],
  "tools": ["Tool 1", "Tool 2", ...],
  "skills": ["Skill 1", "Skill 2", ...],
  "awards": [
    { "event": "Event Name", "achievement": "Achievement Details" }
  ]
}
```

### How to Add Projects

Edit data/projects.json to add new projects:

```json
{
  "id": "unique-project-id",
  "title": "Project Title",
  "slug": "project-slug-url",
  "categoryId": "env-art",
  "year": "2024",
  "role": "Your Role",
  "description": "Project description text...",
  "featured": true,
  "published": true,
  "sortOrder": 1,
  "software": ["Unreal Engine 5", "Maya", "Substance 3D Painter"],
  "coverImage": "assets/projects/project-name/cover.webp",
  "heroImage": "assets/projects/project-name/hero.webp",
  "gallery": [
    { "type": "IMAGE", "url": "assets/projects/project-name/gallery-1.webp", "alt": "Description", "sortOrder": 0 }
  ],
  "wireframe": [...],
  "clay": [...],
  "textureMaps": [...],
  "materials": [...],
  "lighting": [...],
  "breakdown": [...],
  "video": "assets/projects/project-name/video.mp4",
  "vrVideo": "assets/projects/project-name/vr.mp4",
  "model3D": "assets/projects/project-name/model.glb",
  "optimization": "Performance notes...",
  "credits": []
}
```

**Required Fields:** id, title, slug, categoryId, published
**Optional Fields:** featured, sortOrder, all media assets

### How to Update Categories

Edit data/categories.json:

```json
[
  { "id": "env-art", "name": "Environment Art", "slug": "environment-art" },
  { "id": "rt-vr", "name": "Real-Time / VR", "slug": "real-time-vr" },
  { "id": "characters", "name": "Character Art", "slug": "character-art" }
]
```

### How to Change the Video Background

1. Place your video file in the public/ folder (Flask static folder)
2. Update the video source in index.html line 87:
   ```html
   <source src="/your-video-name.mp4" type="video/mp4">
   ```

### How to Add Project Images

1. Create a folder in root directory: assets/projects/project-name/
2. Add images with recommended naming:
   - cover.webp - Grid thumbnail (16:9 aspect ratio)
   - hero.webp - Full-width hero image
   - gallery-1.webp, gallery-2.webp - Gallery images
   - wireframe.webp - Wireframe view
   - clay.webp - Clay render
   - textures.webp - Texture breakdown
   - materials.webp - Material graph
   - lighting.webp - Lighting breakdown
   - breakdown.webp - Full pipeline breakdown

---

## File Requirements

### Video File
- **Location:** public/ folder
- **Format:** MP4 (H.264 codec recommended)
- **Recommended:** 1920x1080 or higher, under 10MB for fast loading
- **HTML reference:** /video-filename.mp4

### Image Dimensions

| Type | Recommended Size | Aspect Ratio |
|------|------------------|---------------|
| Cover/Thumbnail | 1920x1080 | 16:9 |
| Hero | 1920x1080 | 16:9 |
| Gallery | 1920x1080 | 16:9 or variable |
| Profile | 600x600+ | 1:1 (square) |
| OG Image | 1200x630 | 1.91:1 |

### JSON Structure Requirements

- All JSON files must be valid JSON (no trailing commas)
- Use UTF-8 encoding with BOM for Windows compatibility
- Date fields: ISO 8601 format with Z suffix (e.g., 2024-06-01T00:00:00Z)
- Image paths: relative from project root (e.g., assets/projects/...)

---

## Development Notes

- Server runs on port 5000 by default (configurable via PORT env var)
- debug=True enables auto-reload on file changes
- For production, set debug=False and use a WSGI server like Gunicorn
- CORS is enabled for all routes
- All API endpoints return JSON with Content-Type: application/json
