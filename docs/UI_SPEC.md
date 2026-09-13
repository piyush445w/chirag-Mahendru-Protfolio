# UI Specification Documentation

## Design System

### Color Palette

The design system uses an onyx (near-black) background with amber/gold accents, defined as CSS custom properties in `styles.css`:

| Token | Value | Usage |
|---|---|---|
| `--bg-dark` | `#0a0a0a` | Primary background (body) |
| `--bg-darker` | `#111111` | Elevated background |
| `--bg-card` | `rgba(26, 26, 26, 0.8)` | Card surfaces with glass effect |
| `--primary` | `#f59e0b` | Primary amber accent (buttons, highlights) |
| `--primary-dark` | `#d97706` | Darker amber for hover states |
| `--secondary` | `#fbbf24` | Light amber for secondary accents |
| `--accent` | `#f59e0b` | Alias for `--primary` |
| `--text-primary` | `#ffffff` | Primary text |
| `--text-secondary` | `#a1a1aa` | Secondary text |
| `--text-muted` | `#71717a` | Muted/placeholder text |
| `--glass-bg` | `rgba(255, 255, 255, 0.03)` | Glassmorphism backgrounds |
| `--glass-border` | `rgba(255, 255, 255, 0.08)` | Glassmorphism borders |
| `--glow-primary` | `0 0 20px rgba(245, 158, 11, 0.35)` | Amber glow shadow |
| `--glow-secondary` | `0 0 20px rgba(251, 191, 36, 0.35)` | Light amber glow shadow |

### Typography

| Token | Value | Usage |
|---|---|---|
| `--font-main` | `'Inter', -apple-system, BlinkMacSystemFont, sans-serif` | Body text, UI elements |
| `--font-display` | `'Cormorant Garamond', serif` | Hero title italic accent ("Beyond") |
| `--font-mono` | `'SF Mono', 'Fira Code', 'Consolas', 'Monaco', monospace` | Labels, tags, navigation, meta text |

Body text uses Inter at 16px base. Section labels, nav links, tags, and metadata use JetBrains Mono/SF Mono at 10-14px with uppercase and wide letter-spacing.

### Transitions

| Token | Value | Usage |
|---|---|---|
| `--transition-fast` | `0.2s ease` | Hover states, small interactions |
| `--transition-normal` | `0.3s ease` | Standard transitions |
| `--transition-slow` | `0.5s ease` | Larger animations, image reveals |

---

## Six-Section Layout

The SPA is organized into six `<section>` elements inside `<main id="main-content">`:

### 1. Hero (`#hero`)

- Full-viewport height section.
- **Background**: Autoplaying muted looping MP4 video (`public/Create_a_cinematic_photoreali.mp4`) with overlay gradients (`video-overlay-bottom`, `video-overlay-sides`) for readability.
- **Content**: Animated entrance with `fadeInUp` keyframe (opacity 0 -> 1, translateY 48px -> 0, delay 0.3s).
- **Badge**: "3D Environment Artist" pill in amber-tinted background.
- **Title**: Three-line heading using Cormorant Garamond. "Beyond" is italic and amber-colored (`--font-display`, `--primary`).
- **Subtitle**: Software tools list; dynamically populated from `settings.subtitle`.
- **CTA Buttons**: "View Work" (filled amber) and "Get In Touch" (outlined).
- **Scroll Indicator**: Fixed "Scroll" text with animated line (`scrollBounce` keyframe).

### 2. About (`#about`)

- Two-column grid: content left, image right.
- **Left column**: Name (`#about-name`), bio (`#about-bio`), tool tags (`#about-tools`), skills container, process steps container, education card.
- **Right column**: Profile image with overlay, location badge ("Based in Punjab, India").
- **Process Steps**: Four-step workflow (Blockout, Modeling, Materials, Lighting) rendered as numbered cards with IntersectionObserver-triggered staggered entrance.
- **Education Card**: Rendered from `settings.education` array; shows institution, degree, focus, specialization.

### 3. Work / Projects (`#work`)

- Full-width section with centered container.
- Header: "Selected Work" label + "Projects." title.
- **Projects Grid**: Dynamically rendered cards from `GET /api/projects`.
- Each card contains: cover image with hover overlay ("View Project"), title, description, software tags.
- **Card Interactions**: Mouseenter scales image 1.1x and reveals overlay; mouseleave reverses. Click navigates to `#project/<id>` hash route.
- **Empty State**: Shown when no projects are loaded.

### 4. Resume (`#resume`)

- Grid layout with multiple sub-sections:
  - Header: name, title, contact (email | location).
  - Summary: rendered from `settings.resume.summary` or `settings.bio`.
  - Experience list: rendered from `settings.resume.experience` array.
  - Skills: rendered from `settings.resume.skills` or `settings.skills`.
  - Awards: rendered from `settings.awards`.
  - Software: rendered from `settings.resume.software`.
- Background gradient via `.section-bg-gradient`.

### 5. Services (`#services`)

- Grid of service cards rendered from `settings.services` array.
- Each card: title + description.

### 6. Contact (`#contact`)

- Two-column grid: contact info left, form right.
- **Contact Info**: Email, phone (hardcoded `7719661103`), LinkedIn link, location. Social links rendered from `settings.socials`.
- **Contact Form**: Name, email, subject, message fields. Client-side only; shows demo alert on submit.

---

## Navigation

### Desktop Navigation

- Fixed navbar (`#navbar`) at top of page.
- Logo: "Chirag." with amber dot accent.
- Nav links: Home, About, Work, Resume, Services, Contact.
- Smooth scroll on click via `smoothScrollTo()`.
- Active link highlighting based on scroll position (`updateActiveNavLink()`).
- Scrolled state: background becomes opaque with backdrop blur after `scrollY > 50`.

### Mobile Menu

- Hamburger button (`#menu-btn`) with `aria-label="Toggle menu"` and `aria-expanded` attribute.
- Full-screen overlay menu (`#mobile-menu`) with animated `translateX` entry (cubic-bezier easing).
- Background glow effects (blue, purple).
- Close icon toggles with menu icon.
- Menu auto-closes on link click and when viewport exceeds 768px.

---

## 3D Tilt Physics and Mouse Tracking

### Custom Cursor

- Two elements: `.cursor-follower` (large ring, 40px) and `.cursor-dot` (small dot, 8px).
- Position tracks `mousemove` events (throttled at 16ms).
- `mouseleave` on window hides both elements.
- Hover state: follower scales to 0.6, dot scales to 1.8, both turn amber.

### Parallax

- Elements with `data-parallax` attribute are tracked.
- `updateParallax()` calculates offset based on element center Y position relative to viewport center, multiplied by `data-parallax` speed factor.
- Applied on every scroll frame (throttled at 16ms).

### Project Card Hover

- `mouseenter`: cover image scales to 1.1x, overlay opacity becomes 1.
- `mouseleave`: reverses to scale(1) and opacity 0.

### Particles

- Canvas-based particle system in `#particles` container.
- 50 particles with random position, velocity (0.5px/frame), size (1-3px), and opacity (0.2-0.7).
- Particles wrap around canvas edges.
- Rendered at 60fps via `requestAnimationFrame`.

### Scroll Progress Bar

- Fixed 3px bar at top of viewport (`#scroll-progress`).
- Width calculated as `(scrollTop / (docHeight - viewportHeight)) * 100`.
- Gradient: `linear-gradient(90deg, #6366f1, #8b5cf6)` (indigo to violet).

---

## Responsive Breakpoints

### Public Site (`styles.css`)

| Breakpoint | Rules |
|---|---|
| `min-width: 640px` | Hero title font-size increases to 64px |
| `min-width: 768px` | Desktop nav links visible (flex); mobile menu hidden |
| `min-width: 1024px` | Hero title font-size increases to 96px |
| `max-width: 768px` | Custom cursor hidden; mobile layout adjustments |

### Admin Dashboard (`app.py` inline CSS)

| Breakpoint | Rules |
|---|---|
| `max-width: 1024px` | Stats grid: 2 columns |
| `max-width: 768px` | Sidebar becomes off-canvas overlay with toggle button; stats grid: 1 column; project items stack vertically; form grid: 1 column |
| `max-width: 480px` | Login card padding reduced, font sizes reduced |

---

## Admin UI Design

### Layout

- Fixed 260px left sidebar with branding header ("Chirah Admin", "Portfolio Management").
- Sidebar navigation: Dashboard, Projects, Skills, Experience, Logout (with SVG icons).
- Sticky header bar with backdrop blur (`rgba(20, 20, 20, 0.8)`).
- Main content area with 32px padding.

### Components

| Component | Description |
|---|---|
| Stat Card | Dark card with uppercase label and large counter value. Published count uses amber color. |
| Form Card | Dark card with form fields in 2-column grid. Inputs have onyx-800 bg, onyx-600 border, amber focus ring. |
| Data Table | Full-width table with uppercase headers, hover row highlight, Edit/Delete action buttons. |
| Badge | Small pill: green for Published, gray for Draft. |
| Buttons | Primary (amber gradient), Secondary (dark with border), Danger (red tinted). |
| Empty State | Centered text when no data exists. |

### Mobile Sidebar

- Hidden by default below 768px (`transform: translateX(-100%)`).
- Toggle button in header opens sidebar with overlay backdrop.
- Overlay click closes sidebar.

---

## Accessibility Features

- **Skip Link**: `<a href="#main-content" class="skip-link">Skip to main content</a>` as first element in body.
- **ARIA Roles**: `role="navigation"` on `<nav>`, `role="main"` on `<main>`.
- **ARIA Labels**: Hamburger button has `aria-label="Toggle menu"` and `aria-expanded="false"`.
- **ARIA Live**: Projects container has `aria-live="polite"` for screen reader announcements when content loads.
- **Alt Text**: All project images have `alt` attributes set to project title.
- **Focus Styles**: Form inputs have visible amber focus rings (`box-shadow: 0 0 0 1px var(--amber-500)`).
- **Semantic HTML**: Uses `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`, `<footer>` throughout.
- **External Links**: Social/contact links use `target="_blank" rel="noopener noreferrer"`.
