# Chirag Mahendru Portfolio - Setup Manual

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Python 3.9+** - Download from python.org
- **pip** - Included with Python 3.9+
- **A modern web browser** - Chrome, Firefox, Edge, or Safari

---

## Step 1: Get the Project

Clone or extract the project files to your desired location.

---

## Step 2: Create a Virtual Environment

A virtual environment isolates project dependencies from your system Python.

**Windows PowerShell:**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If script execution is disabled, run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

**Windows CMD:**
```cmd
python -m venv .venv
.venv\Scripts\activate.bat
```

**Linux/macOS:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

You should see `(.venv)` appear in your terminal prompt when activated.

---

## Step 3: Install Dependencies

With the virtual environment active:

```powershell
pip install -r requirements.txt
```

This installs:
- `Flask>=3.0.0` - Web framework
- `flask-cors>=4.0.0` - Cross-origin resource sharing support

---

## Step 4: Configure Environment Variables

The application uses environment variables for sensitive configuration.

### Set the Admin Password

Used to log in to `/admin/login`.

**PowerShell:**
```powershell
$env:ADMIN_PASSWORD = "my-secure-admin-password"
```

**CMD:**
```cmd
set ADMIN_PASSWORD=my-secure-admin-password
```

### Set the Flask Secret Key

Used to sign session cookies.

**PowerShell:**
```powershell
$env:FLASK_SECRET_KEY = "a-very-long-random-secret-string"
```

### Set Port and Debug Mode (Optional)

```powershell
$env:PORT = "5000"
$env:DEBUG = "1"
```

| Variable | Default | Description |
|----------|---------|-------------|
| `ADMIN_PASSWORD` | `admin123` | Admin login password |
| `FLASK_SECRET_KEY` | Random (dev) | Session signing key |
| `PORT` | `5000` | Server port |
| `DEBUG` | `1` | Enable debug mode |

---

## Step 5: Verify Data Files

The application uses JSON files in `data/`. These are **auto-created** if they do not exist:

- `data/settings.json` - Site-wide settings
- `data/projects.json` - Project list
- `data/categories.json` - Categories
- `data/media.json` - Media metadata

No manual setup required.

---

## Step 6: Run the Server

```powershell
python app.py
```

Output should show:
```
 * Running on http://0.0.0.0:5000
 * Debug mode: on
```

---

## Step 7: Access the Website

Open `http://localhost:5000` in your browser.

---

## Step 8: Access the Admin Panel

1. Navigate to `http://localhost:5000/admin/login`
2. Enter your admin password
3. Click **Sign In**
4. Dashboard available at `http://localhost:5000/admin`

---

## Step 9: Add Content via Admin Panel

- **Projects**: `/admin/projects` - Create, edit, publish projects
- **Categories**: `/admin/categories` - Manage project categories
- **Settings**: `/admin/settings` - Edit site-wide settings, skills, experience
- **Media**: `/admin/media` - Upload and manage files
- **SEO**: `/admin/seo` - Edit SEO title, description, OG image

---

## Step 10: Verify Installation

```powershell
curl http://localhost:5000/api/settings
curl http://localhost:5000/api/projects
curl http://localhost:5000/api/categories
```

All should return valid JSON.

---

## Troubleshooting

### Port Already in Use
```powershell
$env:PORT = "8080"
python app.py
```

### Module Not Found
```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Permission Denied (Windows)
Run PowerShell as Administrator, or use CMD activation.

### Admin Login Fails
1. Verify ADMIN_PASSWORD is set correctly
2. Restart the server after changing password
3. Clear browser cookies if sessions are stale

---

## Deployment

For production:

1. **Disable debug mode**: Set `DEBUG=0`
2. **Set strong ADMIN_PASSWORD** (16+ characters)
3. **Set strong FLASK_SECRET_KEY** (32+ characters)
4. **Use Gunicorn**:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:8000 app:app
   ```
5. **Use a reverse proxy** (nginx/Apache) for SSL
6. **Back up** `data/` and `uploads/` directories

---

## File Locations

| Path | Purpose |
|------|---------|
| `app.py` | Main Flask application |
| `app.js` | Frontend JavaScript |
| `index.html` | Main HTML page |
| `styles.css` | Main stylesheet |
| `requirements.txt` | Python dependencies |
| `data/settings.json` | Site configuration |
| `data/projects.json` | Project data |
| `data/categories.json` | Category data |
| `data/media.json` | Media metadata |

---

## Support

For more details, see:
- `ARCHITECTURE.md` - Backend architecture
- `DATA_MODEL.md` - Data model documentation
- `UI_SPEC.md` - UI specification
- `README.md` - Project overview
